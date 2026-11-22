import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import type { RefObject } from 'react';

import { statusStyle } from '@/utils/statusStyle';
import { createAnimatedStarfield } from './animatedStarfield';

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
    cameraDistanceStart?: number;
    cameraDistanceEnd?: number;
    globeScale?: number;
    verticalOffset?: number;
    backlit?: boolean;
    atmosphereIntensity?: number;
}

export const GlobeView = forwardRef<GlobeViewHandle, GlobeViewProps>(function GlobeView(
    {
        autoRotate = true,
        rotationSpeed = 0.2,
        stateRef,
        focusTarget,
        markers,
        cameraDistance = 4.5,
        cameraDistanceStart,
        cameraDistanceEnd,
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
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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

        // Quando configurado, começa com a câmera um pouco mais próxima.
        // Sem essas propriedades, mantém a distância padrão de cada tela.
        const initialCameraDistance =
            cameraDistanceStart !== undefined && cameraDistanceEnd !== undefined
                ? cameraDistanceStart
                : cameraDistance;

        camera.position.z = initialCameraDistance;

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
        smoothProgressRef.current = THREE.MathUtils.clamp(stateRef.current.progress, 0, 1);
        smoothTargetRef.current = { ...stateRef.current.target };

        // Grupo principal do planeta.
        const globe = new THREE.Group();
        scene.add(globe);

        globe.quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -Math.PI / 2 - THREE.MathUtils.degToRad(stateRef.current.lon),
        );

        const markersGroup = new THREE.Group();
        globe.add(markersGroup);
        markersGroupRef.current = markersGroup;

        // Construção da superfície terrestre.
        const earthTexture = new THREE.TextureLoader().load('/textures/earth.png');
        earthTexture.colorSpace = THREE.SRGBColorSpace;

        const earthMaterial = new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.9,
            metalness: 0,
        });

        const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial);
        globe.add(earth);

        // Atmosfera com iluminação de contraluz.
        const atmosphereGeometry = new THREE.SphereGeometry(backlit ? 1.065 : 1.12, 64, 64);

        const atmosphereMaterial: THREE.Material = backlit
            ? new THREE.ShaderMaterial({
                  uniforms: {
                      uAtmosphereIntensity: {
                          value: THREE.MathUtils.clamp(atmosphereIntensity, 0, 1),
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

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        globe.add(atmosphere);

        // Iluminação da cena.
        const ambientLight = new THREE.AmbientLight('#ffffff', backlit ? 0.9 : 1.5);
        scene.add(ambientLight);

        const sunlight = new THREE.DirectionalLight(
            backlit ? '#a5e7ff' : '#e0f2fe',
            backlit ? 4.5 : 2.5,
        );

        sunlight.position.set(backlit ? -4 : 3, 2, backlit ? -5 : 4);
        scene.add(sunlight);

        // Luz frontal para preservar e clarear os detalhes geográficos.
        if (backlit) {
            const fillLight = new THREE.DirectionalLight('#a5d9ef', 2.0);
            fillLight.position.set(3, 1, 4);
            scene.add(fillLight);
        }

        // =========================================================
        // CAMPO DE ESTRELAS ANIMADO
        // =========================================================

        const starfield = createAnimatedStarfield(scene, camera, pixelRatio);

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

            const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;

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
                camera.position.z = initialCameraDistance;

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

            // Suaviza o progresso e o alvo definidos pela rolagem.
            const { progress, target } = stateRef.current;

            const targetProgress = THREE.MathUtils.clamp(progress, 0, 1);

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

            // A câmera só varia quando a tela fornece uma distância inicial e final.
            // Na exploração, termina na mesma distância usada anteriormente.
            const scrollCameraDistance =
                cameraDistanceStart !== undefined && cameraDistanceEnd !== undefined
                    ? THREE.MathUtils.lerp(cameraDistanceStart, cameraDistanceEnd, smooth)
                    : cameraDistance;

            // Em telas estreitas, afasta um pouco a câmera ao focar uma região.
            const isMobile = size.w < 640;
            const focusCameraDistance = isMobile ? 4.4 : 3.0;

            const desiredCameraZ =
                (focusTargetRef.current ? focusCameraDistance : scrollCameraDistance) /
                zoomLevelRef.current;

            camera.position.z = THREE.MathUtils.lerp(
                camera.position.z,
                desiredCameraZ,
                cameraDamping,
            );

            const { w: width, h: height } = size;

            const startScale = 1.65;
            const endScale = 1.45;
            const currentScale = globeScale ?? THREE.MathUtils.lerp(startScale, endScale, smooth);

            // Reduz o planeta proporcionalmente em telas menores,
            // preservando a escala original em telas a partir de 700px.
            const responsiveScale = Math.min(1, Math.max(0.72, width / 700));

            globe.scale.setScalar(currentScale * responsiveScale);

            const visibleHeight =
                2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;

            // No celular, centraliza o alvo sem o deslocamento do desktop.
            const horizontalOffset = width < 768 ? 0 : 60;

            const targetX =
                ((smoothTargetRef.current.x - horizontalOffset - width / 2) / height) *
                visibleHeight;

            const targetY = -((smoothTargetRef.current.y - height / 2) / height) * visibleHeight;

            const desiredGlobeX = THREE.MathUtils.lerp(0, targetX, smooth);
            const desiredGlobeY = THREE.MathUtils.lerp(0, targetY, smooth) + verticalOffset;

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

                viewDirection.copy(camera.position).sub(globe.position).normalize();

                aim.setFromUnitVectors(forward, viewDirection);

                desired.copy(aim).multiply(focusQuaternionRef.current);

                globe.quaternion.slerp(desired, focusDamping);

                commands.rotation = 0;
            } else if (wasFocusedRef.current) {
                globe.quaternion.slerp(restQuaternion, returnDamping);

                if (globe.quaternion.angleTo(restQuaternion) < 0.01) {
                    globe.quaternion.copy(restQuaternion);
                    wasFocusedRef.current = false;
                }
            } else {
                // Rotação manual com desaceleração suave.
                const rotationStep = commands.rotation * manualRotationDamping;

                globe.rotateY(rotationStep);
                commands.rotation -= rotationStep;

                if (Math.abs(commands.rotation) < 0.001) {
                    commands.rotation = 0;
                }

                // Rotação automática independente da taxa de quadros.
                if (autoRotateRef.current && !reducedMotionRef.current) {
                    globe.rotateY(delta * rotationSpeedRef.current);
                }
            }

            inverse.copy(globe.quaternion).invert();
            localFront.copy(forward).applyQuaternion(inverse);

            stateRef.current.lon = THREE.MathUtils.radToDeg(
                Math.atan2(-localFront.z, localFront.x),
            );

            // Atualiza o campo de estrelas compartilhado.
            starfield.update(delta, reducedMotionRef.current);

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

            starfield.dispose();

            markersGroupRef.current = null;

            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [
        stateRef,
        cameraDistance,
        cameraDistanceStart,
        cameraDistanceEnd,
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

        const geometry = new THREE.SphereGeometry(0.018, 12, 12);

        markers.forEach((marker) => {
            const latitude = (marker.latitude * Math.PI) / 180;
            const longitude = (marker.longitude * Math.PI) / 180;
            const radius = 1.015;

            const position = new THREE.Vector3(
                radius * Math.cos(latitude) * Math.cos(longitude),
                radius * Math.sin(latitude),
                -radius * Math.cos(latitude) * Math.sin(longitude),
            );

            const markerColor = new THREE.Color(statusStyle(marker.status).color).multiplyScalar(
                0.6,
            );

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

    // Atualização do foco geográfico. No mobile, a seleção de uma
    // região não deve girar o globo nem aproximar a câmera para focá-la.
    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 767px)');

        const updateFocus = () => {
            if (mobileQuery.matches) {
                focusTargetRef.current = null;
                focusQuaternionRef.current = null;
                wasFocusedRef.current = false;
                return;
            }

            focusTargetRef.current = focusTarget;

            if (!focusTarget) {
                focusQuaternionRef.current = null;
                return;
            }

            const latitude = THREE.MathUtils.degToRad(focusTarget.latitude);
            const longitude = THREE.MathUtils.degToRad(focusTarget.longitude);

            const yRotation = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                -Math.PI / 2 - longitude,
            );

            const xRotation = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                latitude,
            );

            focusQuaternionRef.current = xRotation.multiply(yRotation);
        };

        updateFocus();

        mobileQuery.addEventListener('change', updateFocus);

        return () => {
            mobileQuery.removeEventListener('change', updateFocus);
        };
    }, [focusTarget]);

    return (
        <div
            ref={containerRef}
            className="h-full w-full"
            aria-label="Globo 3D do GreenER"
            role="img"
        />
    );
});
