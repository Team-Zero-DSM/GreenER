
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

import * as THREE from 'three';
import type { RefObject } from 'react';

import { statusStyle } from '@/utils/statusStyle';

export interface GlobeViewHandle {
    rotateLeft: () => void;
    rotateRight: () => void;
    zoom: (factor: number) => void;
    resetView: () => void;
    resetPosition: () => void;
}

export interface GlobeState {
    progress: number;
    target: { x: number; y: number };
    lon: number;
}

export interface GlobeMarker {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
}

interface GlobeViewProps {
    autoRotate?: boolean;
    rotationSpeed?: number;
    stateRef: RefObject<GlobeState>;
    focusTarget: {
        latitude: number;
        longitude: number;
    } | null;
    markers: GlobeMarker[];

    // Personalização visual do globo.
    cameraDistance?: number;
    globeScale?: number;
    verticalOffset?: number;
    backlit?: boolean;
    atmosphereIntensity?: number;
}

// Configuração do campo de estrelas.
const STAR_COUNT = 1800;
const STAR_MIN_RADIUS = 8;
const STAR_MAX_RADIUS = 28;

// Configuração das estrelas cadentes.
const SHOOTING_STAR_Z = -14;
const SHOOTING_STAR_INITIAL_DELAY = 7;
const SHOOTING_STAR_MIN_INTERVAL = 7;
const SHOOTING_STAR_MAX_INTERVAL = 9;
const SHOOTING_STAR_MIN_DURATION = 0.75;
const SHOOTING_STAR_MAX_DURATION = 1.15;

export const GlobeView = forwardRef<GlobeViewHandle, GlobeViewProps>(
    function GlobeView(
        {
            autoRotate = true,
            rotationSpeed = 0.2,
            stateRef,
            focusTarget,
            markers,
            cameraDistance = 4.5,
            globeScale,
            verticalOffset = 0,
            backlit = false,
            atmosphereIntensity = 1,
        },
        ref,
    ) {
        const containerRef = useRef<HTMLDivElement>(null);
        const autoRotateRef = useRef(autoRotate);
        const rotationSpeedRef = useRef(rotationSpeed);

        const markersGroupRef = useRef<THREE.Group | null>(null);
        const focusQuaternionRef = useRef<THREE.Quaternion | null>(null);
        const focusTargetRef = useRef(focusTarget);

        const zoomLevelRef = useRef(1);
        const wasFocusedRef = useRef(false);
        const reducedMotionRef = useRef(false);

        // Valores suavizados para acompanhar a rolagem sem saltos.
        const smoothProgressRef = useRef(0);
        const smoothTargetRef = useRef({ x: 0, y: 0 });

        const commandsRef = useRef({
            rotation: 0,
            zoomFactor: 1,
            reset: false,
            resetPosition: false,
        });

        useImperativeHandle(
            ref,
            () => ({
                rotateLeft: () => {
                    commandsRef.current.rotation -= Math.PI / 6;
                },
                rotateRight: () => {
                    commandsRef.current.rotation += Math.PI / 6;
                },
                zoom: (factor: number) => {
                    if (factor > 0) {
                        commandsRef.current.zoomFactor *= factor;
                    }
                },
                resetView: () => {
                    commandsRef.current.reset = true;
                },
                resetPosition: () => {
                    commandsRef.current.resetPosition = true;
                },
            }),
            [],
        );

        // Atualiza os controles sem reconstruir a cena.
        useEffect(() => {
            autoRotateRef.current = autoRotate;
        }, [autoRotate]);

        useEffect(() => {
            rotationSpeedRef.current = rotationSpeed;
        }, [rotationSpeed]);

        // Respeita a preferência de movimento reduzido do dispositivo.
        useEffect(() => {
            const mediaQuery = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            );

            const handleChange = (event: MediaQueryListEvent) => {
                reducedMotionRef.current = event.matches;
            };

            reducedMotionRef.current = mediaQuery.matches;
            mediaQuery.addEventListener('change', handleChange);

            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }, []);

        // Inicialização e renderização da cena 3D.
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.z = cameraDistance;

            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            });

            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            container.appendChild(renderer.domElement);

            // Inicializa os valores suavizados com o estado atual da página.
            smoothProgressRef.current = THREE.MathUtils.clamp(
                stateRef.current.progress,
                0,
                1,
            );
            smoothTargetRef.current = { ...stateRef.current.target };

            // Grupo principal do planeta.
            const globe = new THREE.Group();
            scene.add(globe);

            globe.quaternion.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                -Math.PI / 2 -
                    THREE.MathUtils.degToRad(stateRef.current.lon),
            );

            const markersGroup = new THREE.Group();
            globe.add(markersGroup);
            markersGroupRef.current = markersGroup;

            // Construção da superfície terrestre.
            const earthTexture = new THREE.TextureLoader().load(
                '/textures/earth.png',
            );
            earthTexture.colorSpace = THREE.SRGBColorSpace;

            const earthMaterial = new THREE.MeshStandardMaterial({
                map: earthTexture,
                roughness: 0.9,
                metalness: 0,
            });

            const earth = new THREE.Mesh(
                new THREE.SphereGeometry(1, 64, 64),
                earthMaterial,
            );
            globe.add(earth);

            // Atmosfera com iluminação de contraluz.
            const atmosphereGeometry = new THREE.SphereGeometry(
                backlit ? 1.065 : 1.12,
                64,
                64,
            );

            const atmosphereMaterial: THREE.Material = backlit
                ? new THREE.ShaderMaterial({
                      uniforms: {
                          uAtmosphereIntensity: {
                              value: THREE.MathUtils.clamp(
                                  atmosphereIntensity,
                                  0,
                                  1,
                              ),
                          },
                      },
                      vertexShader: `
                        varying vec3 vNormal;
                        varying vec3 vViewPosition;

                        void main() {
                            vec4 mvPosition =
                                modelViewMatrix * vec4(position, 1.0);

                            vNormal = normalize(normalMatrix * normal);
                            vViewPosition = -mvPosition.xyz;

                            gl_Position =
                                projectionMatrix * mvPosition;
                        }
                    `,
                      fragmentShader: `
                        uniform float uAtmosphereIntensity;

                        varying vec3 vNormal;
                        varying vec3 vViewPosition;

                        void main() {
                            float rim = pow(
                                1.0 - max(
                                    dot(
                                        normalize(vNormal),
                                        normalize(vViewPosition)
                                    ),
                                    0.0
                                ),
                                2.2
                            );

                            vec3 atmosphereColor =
                                vec3(0.10, 0.72, 1.0);

                            gl_FragColor = vec4(
                                atmosphereColor,
                                rim * 1.3 * uAtmosphereIntensity
                            );
                        }
                    `,
                      transparent: true,
                      blending: THREE.AdditiveBlending,
                      side: THREE.FrontSide,
                      depthWrite: false,
                      toneMapped: false,
                  })
                : new THREE.MeshBasicMaterial({
                      color: '#0ea5e9',
                      transparent: true,
                      opacity: 0.12,
                      side: THREE.BackSide,
                  });

            const atmosphere = new THREE.Mesh(
                atmosphereGeometry,
                atmosphereMaterial,
            );
            globe.add(atmosphere);

            // Iluminação da cena.
            const ambientLight = new THREE.AmbientLight(
                '#ffffff',
                backlit ? 0.9 : 1.5,
            );
            scene.add(ambientLight);

            const sunlight = new THREE.DirectionalLight(
                backlit ? '#a5e7ff' : '#e0f2fe',
                backlit ? 4.5 : 2.5,
            );
            sunlight.position.set(
                backlit ? -4 : 3,
                2,
                backlit ? -5 : 4,
            );
            scene.add(sunlight);

            // Luz frontal para preservar e clarear os detalhes geográficos.
            if (backlit) {
                const fillLight = new THREE.DirectionalLight(
                    '#a5d9ef',
                    2.0,
                );
                fillLight.position.set(3, 1, 4);
                scene.add(fillLight);
            }

            // =========================================================
            // CAMPO DE ESTRELAS
            // =========================================================

            const starPositions = new Float32Array(STAR_COUNT * 3);
            const starSizes = new Float32Array(STAR_COUNT);
            const starOpacities = new Float32Array(STAR_COUNT);
            const starPhases = new Float32Array(STAR_COUNT);
            const starTwinkleSpeeds = new Float32Array(STAR_COUNT);
            const starColors = new Float32Array(STAR_COUNT * 3);

            const whiteBlue = new THREE.Color('#eff8ff');
            const cyanBlue = new THREE.Color('#8be1ff');

            for (let i = 0; i < STAR_COUNT; i++) {
                const radius =
                    STAR_MIN_RADIUS +
                    Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS);

                // Distribui as estrelas no hemisfério posterior.
                const zDirection = -(0.3 + Math.random() * 0.7);
                const angle = Math.random() * Math.PI * 2;
                const horizontalRadius = Math.sqrt(
                    1 - zDirection * zDirection,
                );

                starPositions[i * 3] =
                    radius * horizontalRadius * Math.cos(angle);
                starPositions[i * 3 + 1] =
                    radius * horizontalRadius * Math.sin(angle);
                starPositions[i * 3 + 2] = radius * zDirection;

                const highlighted = Math.random() < 0.08;

                starSizes[i] = highlighted
                    ? 1.6 + Math.random() * 0.7
                    : 0.75 + Math.random() * 0.75;

                starOpacities[i] = highlighted
                    ? 0.72 + Math.random() * 0.26
                    : 0.35 + Math.random() * 0.35;

                starPhases[i] = Math.random() * Math.PI * 2;
                starTwinkleSpeeds[i] = 0.45 + Math.random() * 0.9;

                const color =
                    Math.random() < 0.72 ? whiteBlue : cyanBlue;

                starColors[i * 3] = color.r;
                starColors[i * 3 + 1] = color.g;
                starColors[i * 3 + 2] = color.b;
            }

            const starsGeometry = new THREE.BufferGeometry();
            starsGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(starPositions, 3),
            );
            starsGeometry.setAttribute(
                'aSize',
                new THREE.BufferAttribute(starSizes, 1),
            );
            starsGeometry.setAttribute(
                'aOpacity',
                new THREE.BufferAttribute(starOpacities, 1),
            );
            starsGeometry.setAttribute(
                'aPhase',
                new THREE.BufferAttribute(starPhases, 1),
            );
            starsGeometry.setAttribute(
                'aTwinkleSpeed',
                new THREE.BufferAttribute(starTwinkleSpeeds, 1),
            );
            starsGeometry.setAttribute(
                'aColor',
                new THREE.BufferAttribute(starColors, 3),
            );

            const starsMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uPixelRatio: { value: pixelRatio },
                },
                vertexShader: `
                    uniform float uTime;
                    uniform float uPixelRatio;

                    attribute float aSize;
                    attribute float aOpacity;
                    attribute float aPhase;
                    attribute float aTwinkleSpeed;
                    attribute vec3 aColor;

                    varying float vOpacity;
                    varying vec3 vColor;

                    void main() {
                        vec4 mvPosition =
                            modelViewMatrix * vec4(position, 1.0);

                        float twinkle =
                            0.5 + 0.5 * sin(
                                uTime * aTwinkleSpeed + aPhase
                            );

                        vOpacity = aOpacity * (0.62 + 0.38 * twinkle);
                        vColor = aColor;

                        gl_PointSize =
                            aSize *
                            uPixelRatio *
                            (40.0 / max(-mvPosition.z, 1.0));

                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying float vOpacity;
                    varying vec3 vColor;

                    void main() {
                        vec2 centered = gl_PointCoord - vec2(0.5);
                        float distanceToCenter = length(centered);

                        float halo = 1.0 - smoothstep(
                            0.05,
                            0.5,
                            distanceToCenter
                        );

                        float core = 1.0 - smoothstep(
                            0.0,
                            0.16,
                            distanceToCenter
                        );

                        float alpha =
                            (halo * 0.48 + core * 1.2) * vOpacity;

                        if (alpha < 0.015) discard;

                        gl_FragColor = vec4(vColor, alpha);

                        #include <tonemapping_fragment>
                        #include <colorspace_fragment>
                    }
                `,
                transparent: true,
                depthWrite: false,
                depthTest: true,
                blending: THREE.AdditiveBlending,
                toneMapped: false,
            });

            const stars = new THREE.Points(starsGeometry, starsMaterial);
            stars.frustumCulled = false;
            scene.add(stars);

            // =========================================================
            // ESTRELAS CADENTES
            // =========================================================

            const shootingStarGroup = new THREE.Group();
            shootingStarGroup.visible = false;

            const trailPositions = new Float32Array(12);
            const trailGeometry = new THREE.BufferGeometry();

            trailGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(
                    trailPositions,
                    3,
                ).setUsage(THREE.DynamicDrawUsage),
            );
            trailGeometry.setAttribute(
                'aTrailProgress',
                new THREE.BufferAttribute(
                    new Float32Array([0, 0, 1, 1]),
                    1,
                ),
            );
            trailGeometry.setAttribute(
                'aTrailSide',
                new THREE.BufferAttribute(
                    new Float32Array([-1, 1, -1, 1]),
                    1,
                ),
            );
            trailGeometry.setIndex([0, 1, 2, 2, 1, 3]);

            const trailMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uOpacity: { value: 0 },
                },
                vertexShader: `
                    attribute float aTrailProgress;
                    attribute float aTrailSide;

                    varying float vTrailProgress;
                    varying float vTrailSide;

                    void main() {
                        vTrailProgress = aTrailProgress;
                        vTrailSide = aTrailSide;

                        gl_Position =
                            projectionMatrix *
                            modelViewMatrix *
                            vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uOpacity;

                    varying float vTrailProgress;
                    varying float vTrailSide;

                    void main() {
                        float sideFade = 1.0 - smoothstep(
                            0.12,
                            1.0,
                            abs(vTrailSide)
                        );

                        float tailFade = smoothstep(
                            0.0,
                            0.9,
                            vTrailProgress
                        );

                        float alpha = sideFade * tailFade * uOpacity;

                        vec3 trailColor = mix(
                            vec3(0.12, 0.48, 0.9),
                            vec3(0.72, 0.92, 1.0),
                            vTrailProgress
                        );

                        gl_FragColor = vec4(trailColor, alpha);

                        #include <tonemapping_fragment>
                        #include <colorspace_fragment>
                    }
                `,
                transparent: true,
                depthWrite: false,
                depthTest: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                toneMapped: false,
            });

            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            trail.frustumCulled = false;

            const shootingHeadGeometry = new THREE.BufferGeometry();
            const headPositions = new Float32Array(3);

            shootingHeadGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(
                    headPositions,
                    3,
                ).setUsage(THREE.DynamicDrawUsage),
            );

            const shootingGlowMaterial = new THREE.PointsMaterial({
                color: '#38bdf8',
                size: 0.24,
                transparent: true,
                opacity: 0.4,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const shootingGlow = new THREE.Points(
                shootingHeadGeometry,
                shootingGlowMaterial,
            );

            const shootingCoreMaterial = new THREE.PointsMaterial({
                color: '#effaff',
                size: 0.085,
                transparent: true,
                opacity: 0.95,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const shootingCore = new THREE.Points(
                shootingHeadGeometry,
                shootingCoreMaterial,
            );

            shootingStarGroup.add(trail);
            shootingStarGroup.add(shootingGlow);
            shootingStarGroup.add(shootingCore);
            scene.add(shootingStarGroup);

            // Estado da animação das estrelas cadentes.
            let elapsedSeconds = 0;
            let nextShootingStarAt =
                SHOOTING_STAR_INITIAL_DELAY + Math.random() * 2;

            let shootingStarActive = false;
            let shootingStarElapsed = 0;
            let shootingStarDuration = 1;
            let shootingStarDistance = 4;
            let shootingStarTrailLength = 1.5;

            const shootingStart = new THREE.Vector3();
            const shootingDirection = new THREE.Vector3();
            const shootingHeadPosition = new THREE.Vector3();
            const shootingTailPosition = new THREE.Vector3();
            const shootingPerpendicular = new THREE.Vector3();

            const spawnShootingStar = () => {
                const visibleHeight =
                    2 *
                    Math.tan(
                        THREE.MathUtils.degToRad(camera.fov / 2),
                    ) *
                    (camera.position.z - SHOOTING_STAR_Z);

                const visibleWidth = visibleHeight * camera.aspect;
                const startsOnRight = Math.random() < 0.5;

                shootingStart.set(
                    (startsOnRight ? 1 : -1) * visibleWidth * 0.46,
                    (Math.random() - 0.5) * visibleHeight * 0.65,
                    SHOOTING_STAR_Z,
                );

                shootingDirection.set(
                    startsOnRight ? -0.85 : 0.85,
                    (Math.random() < 0.5 ? -1 : 1) *
                        (0.3 + Math.random() * 0.35),
                    0,
                ).normalize();

                shootingStarDuration =
                    SHOOTING_STAR_MIN_DURATION +
                    Math.random() *
                        (SHOOTING_STAR_MAX_DURATION -
                            SHOOTING_STAR_MIN_DURATION);

                shootingStarDistance = 3.8 + Math.random() * 1.6;
                shootingStarTrailLength = 1.2 + Math.random() * 0.8;
                shootingStarElapsed = 0;
                shootingStarActive = true;
                shootingStarGroup.visible = true;
            };

            const updateShootingStar = (progress: number) => {
                shootingHeadPosition
                    .copy(shootingStart)
                    .addScaledVector(
                        shootingDirection,
                        shootingStarDistance * progress,
                    );

                shootingTailPosition
                    .copy(shootingHeadPosition)
                    .addScaledVector(
                        shootingDirection,
                        -shootingStarTrailLength,
                    );

                shootingPerpendicular.set(
                    -shootingDirection.y,
                    shootingDirection.x,
                    0,
                ).multiplyScalar(0.018);

                const positions = trailGeometry.attributes
                    .position.array as Float32Array;

                // Extremidade posterior superior.
                positions[0] =
                    shootingTailPosition.x + shootingPerpendicular.x;
                positions[1] =
                    shootingTailPosition.y + shootingPerpendicular.y;
                positions[2] = SHOOTING_STAR_Z;

                // Extremidade posterior inferior.
                positions[3] =
                    shootingTailPosition.x - shootingPerpendicular.x;
                positions[4] =
                    shootingTailPosition.y - shootingPerpendicular.y;
                positions[5] = SHOOTING_STAR_Z;

                // Extremidade dianteira superior.
                positions[6] =
                    shootingHeadPosition.x + shootingPerpendicular.x;
                positions[7] =
                    shootingHeadPosition.y + shootingPerpendicular.y;
                positions[8] = SHOOTING_STAR_Z;

                // Extremidade dianteira inferior.
                positions[9] =
                    shootingHeadPosition.x - shootingPerpendicular.x;
                positions[10] =
                    shootingHeadPosition.y - shootingPerpendicular.y;
                positions[11] = SHOOTING_STAR_Z;

                trailGeometry.attributes.position.needsUpdate = true;

                const headAttribute =
                    shootingHeadGeometry.attributes.position;

                headAttribute.setXYZ(
                    0,
                    shootingHeadPosition.x,
                    shootingHeadPosition.y,
                    SHOOTING_STAR_Z,
                );
                headAttribute.needsUpdate = true;

                const fade = Math.sin(Math.PI * progress);
                trailMaterial.uniforms.uOpacity.value = fade;
                shootingGlowMaterial.opacity = 0.4 * fade;
                shootingCoreMaterial.opacity = 0.95 * fade;
            };

            // =========================================================
            // RESPONSIVIDADE DO RENDERIZADOR
            // =========================================================

            const size = {
                w: container.clientWidth,
                h: container.clientHeight,
            };

            const resizeObserver = new ResizeObserver(() => {
                size.w = container.clientWidth;
                size.h = container.clientHeight;

                if (!size.w || !size.h) return;

                camera.aspect = size.w / size.h;
                camera.updateProjectionMatrix();
                renderer.setSize(size.w, size.h);
            });

            resizeObserver.observe(container);

            let animationId = 0;
            let previousTime = 0;

            const restQuaternion = new THREE.Quaternion();
            const inverse = new THREE.Quaternion();
            const localFront = new THREE.Vector3();
            const forward = new THREE.Vector3(0, 0, 1);
            const viewDirection = new THREE.Vector3();
            const aim = new THREE.Quaternion();
            const desired = new THREE.Quaternion();

            // =========================================================
            // CICLO DE ANIMAÇÃO
            // =========================================================

            const animate = (time: number) => {
                animationId = requestAnimationFrame(animate);

                const delta = previousTime
                    ? Math.min((time - previousTime) / 1000, 0.05)
                    : 0;

                previousTime = time;

                // Fatores exponenciais: movimento consistente em diferentes FPS.
                const cameraDamping = 1 - Math.exp(-4 * delta);
                const scrollDamping = 1 - Math.exp(-6 * delta);
                const positionDamping = 1 - Math.exp(-7 * delta);
                const focusDamping = 1 - Math.exp(-3.5 * delta);
                const returnDamping = 1 - Math.exp(-3 * delta);
                const manualRotationDamping = 1 - Math.exp(-7 * delta);

                const commands = commandsRef.current;

                if (commands.reset) {
                    commands.rotation = 0;
                    commands.zoomFactor = 1;
                    zoomLevelRef.current = 1;
                    commands.reset = false;
                }

                if (commands.resetPosition) {
                    globe.position.set(0, 0, 0);
                    globe.quaternion.identity();
                    camera.position.z = cameraDistance;
                    commands.rotation = 0;
                    commands.zoomFactor = 1;
                    zoomLevelRef.current = 1;
                    wasFocusedRef.current = false;
                    commands.resetPosition = false;
                }

                if (commands.zoomFactor !== 1) {
                    zoomLevelRef.current = THREE.MathUtils.clamp(
                        zoomLevelRef.current / commands.zoomFactor,
                        0.6,
                        2,
                    );
                    commands.zoomFactor = 1;
                }

                const desiredCameraZ =
                    (focusTargetRef.current ? 3.0 : cameraDistance) /
                    zoomLevelRef.current;

                camera.position.z = THREE.MathUtils.lerp(
                    camera.position.z,
                    desiredCameraZ,
                    cameraDamping,
                );

                // Suaviza o progresso e o alvo definidos pela rolagem.
                const { progress, target } = stateRef.current;

                const targetProgress = THREE.MathUtils.clamp(
                    progress,
                    0,
                    1,
                );

                smoothProgressRef.current = THREE.MathUtils.lerp(
                    smoothProgressRef.current,
                    targetProgress,
                    scrollDamping,
                );

                smoothTargetRef.current.x = THREE.MathUtils.lerp(
                    smoothTargetRef.current.x,
                    target.x,
                    scrollDamping,
                );

                smoothTargetRef.current.y = THREE.MathUtils.lerp(
                    smoothTargetRef.current.y,
                    target.y,
                    scrollDamping,
                );

                const p = smoothProgressRef.current;
                const smooth = p * p * (3 - 2 * p);
                const { w: width, h: height } = size;

                const startScale = 1.65;
                const endScale = 1.45;
                const currentScale =
                    globeScale ??
                    THREE.MathUtils.lerp(
                        startScale,
                        endScale,
                        smooth,
                    );

                globe.scale.setScalar(currentScale);

                const visibleHeight =
                    2 *
                    Math.tan(
                        THREE.MathUtils.degToRad(camera.fov / 2),
                    ) *
                    camera.position.z;

                const horizontalOffset = 60;
                const targetX =
                    ((smoothTargetRef.current.x - horizontalOffset - width / 2) /
                        height) *
                    visibleHeight;

                const targetY =
                    -((smoothTargetRef.current.y - height / 2) / height) *
                    visibleHeight;

                const desiredGlobeX = THREE.MathUtils.lerp(
                    0,
                    targetX,
                    smooth,
                );

                const desiredGlobeY =
                    THREE.MathUtils.lerp(0, targetY, smooth) +
                    verticalOffset;

                globe.position.x = THREE.MathUtils.lerp(
                    globe.position.x,
                    desiredGlobeX,
                    positionDamping,
                );

                globe.position.y = THREE.MathUtils.lerp(
                    globe.position.y,
                    desiredGlobeY,
                    positionDamping,
                );

                // Direcionamento suave do planeta para uma região.
                if (focusQuaternionRef.current) {
                    if (!wasFocusedRef.current) {
                        restQuaternion.copy(globe.quaternion);
                    }

                    wasFocusedRef.current = true;

                    viewDirection
                        .copy(camera.position)
                        .sub(globe.position)
                        .normalize();

                    aim.setFromUnitVectors(forward, viewDirection);

                    desired
                        .copy(aim)
                        .multiply(focusQuaternionRef.current);

                    globe.quaternion.slerp(
                        desired,
                        focusDamping,
                    );

                    commands.rotation = 0;
                } else if (wasFocusedRef.current) {
                    globe.quaternion.slerp(
                        restQuaternion,
                        returnDamping,
                    );

                    if (
                        globe.quaternion.angleTo(restQuaternion) < 0.01
                    ) {
                        globe.quaternion.copy(restQuaternion);
                        wasFocusedRef.current = false;
                    }
                } else {
                    // Rotação manual com desaceleração suave.
                    const rotationStep =
                        commands.rotation * manualRotationDamping;

                    globe.rotateY(rotationStep);
                    commands.rotation -= rotationStep;

                    if (Math.abs(commands.rotation) < 0.001) {
                        commands.rotation = 0;
                    }

                    // Rotação automática independente da taxa de quadros.
                    if (
                        autoRotateRef.current &&
                        !reducedMotionRef.current
                    ) {
                        globe.rotateY(delta * rotationSpeedRef.current);
                    }
                }

                inverse.copy(globe.quaternion).invert();
                localFront.copy(forward).applyQuaternion(inverse);

                stateRef.current.lon = THREE.MathUtils.radToDeg(
                    Math.atan2(-localFront.z, localFront.x),
                );

                // Animação das estrelas e estrelas cadentes.
                if (!reducedMotionRef.current) {
                    elapsedSeconds += delta;
                    starsMaterial.uniforms.uTime.value = elapsedSeconds;

                    if (
                        !shootingStarActive &&
                        elapsedSeconds >= nextShootingStarAt
                    ) {
                        spawnShootingStar();
                    }

                    if (shootingStarActive) {
                        shootingStarElapsed += delta;

                        const shootingProgress =
                            THREE.MathUtils.clamp(
                                shootingStarElapsed /
                                    shootingStarDuration,
                                0,
                                1,
                            );

                        updateShootingStar(shootingProgress);

                        if (shootingProgress >= 1) {
                            shootingStarActive = false;
                            shootingStarGroup.visible = false;

                            nextShootingStarAt =
                                elapsedSeconds +
                                SHOOTING_STAR_MIN_INTERVAL +
                                Math.random() *
                                    (SHOOTING_STAR_MAX_INTERVAL -
                                        SHOOTING_STAR_MIN_INTERVAL);
                        }
                    }
                } else {
                    shootingStarGroup.visible = false;
                    shootingStarActive = false;
                }

                renderer.render(scene, camera);
            };

            animate(0);

            // =========================================================
            // LIBERAÇÃO DOS RECURSOS
            // =========================================================

            return () => {
                cancelAnimationFrame(animationId);
                resizeObserver.disconnect();

                markersGroup.children.forEach((pin) => {
                    if (pin instanceof THREE.Mesh) {
                        pin.material.dispose();
                    }
                });
                markersGroup.clear();

                earth.geometry.dispose();
                earthMaterial.dispose();
                earthTexture.dispose();

                atmosphereGeometry.dispose();
                atmosphereMaterial.dispose();

                starsGeometry.dispose();
                starsMaterial.dispose();

                trailGeometry.dispose();
                trailMaterial.dispose();

                shootingHeadGeometry.dispose();
                shootingGlowMaterial.dispose();
                shootingCoreMaterial.dispose();

                markersGroupRef.current = null;

                renderer.dispose();
                renderer.domElement.remove();
            };
        }, [
            stateRef,
            cameraDistance,
            globeScale,
            verticalOffset,
            backlit,
            atmosphereIntensity,
        ]);

        // Atualização dos marcadores geográficos.
        useEffect(() => {
            const group = markersGroupRef.current;
            if (!group) return;

            group.clear();

            const geometry = new THREE.SphereGeometry(
                0.018,
                12,
                12,
            );

            markers.forEach((marker) => {
                const latitude =
                    (marker.latitude * Math.PI) / 180;
                const longitude =
                    (marker.longitude * Math.PI) / 180;
                const radius = 1.015;

                const position = new THREE.Vector3(
                    radius * Math.cos(latitude) * Math.cos(longitude),
                    radius * Math.sin(latitude),
                    -radius * Math.cos(latitude) * Math.sin(longitude),
                );

                const markerColor = new THREE.Color(
    statusStyle(marker.status).color,
).multiplyScalar(0.6);

const material = new THREE.MeshBasicMaterial({
    color: markerColor,
});

                const pin = new THREE.Mesh(geometry, material);
                pin.position.copy(position);
                pin.userData = {
                    id: marker.id,
                    name: marker.name,
                    status: marker.status,
                };

                group.add(pin);
            });

            return () => {
                group.children.forEach((pin) => {
                    if (pin instanceof THREE.Mesh) {
                        pin.material.dispose();
                    }
                });

                group.clear();
                geometry.dispose();
            };
        }, [markers]);

        // Atualização do foco geográfico.
        useEffect(() => {
            focusTargetRef.current = focusTarget;

            if (!focusTarget) {
                focusQuaternionRef.current = null;
                return;
            }

            const latitude = THREE.MathUtils.degToRad(
                focusTarget.latitude,
            );
            const longitude = THREE.MathUtils.degToRad(
                focusTarget.longitude,
            );

            const yRotation = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                -Math.PI / 2 - longitude,
            );

            const xRotation = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                latitude,
            );

            focusQuaternionRef.current = xRotation.multiply(yRotation);
        }, [focusTarget]);

        return (
            <div
                ref={containerRef}
                className="h-full w-full"
                aria-label="Globo 3D do GreenER"
                role="img"
            />
        );
    },
);
