import * as THREE from 'three';

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

export interface AnimatedStarfield {
    update: (delta: number, reducedMotion: boolean) => void;
    dispose: () => void;
}

// Cria o campo de estrelas dentro de uma cena Three.js existente.
export function createAnimatedStarfield(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2),
): AnimatedStarfield {
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
        const radius = STAR_MIN_RADIUS + Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS);

        const zDirection = -(0.3 + Math.random() * 0.7);
        const angle = Math.random() * Math.PI * 2;
        const horizontalRadius = Math.sqrt(1 - zDirection * zDirection);

        starPositions[i * 3] = radius * horizontalRadius * Math.cos(angle);
        starPositions[i * 3 + 1] = radius * horizontalRadius * Math.sin(angle);
        starPositions[i * 3 + 2] = radius * zDirection;

        const highlighted = Math.random() < 0.08;

        starSizes[i] = highlighted ? 1.6 + Math.random() * 0.7 : 0.75 + Math.random() * 0.75;

        starOpacities[i] = highlighted ? 0.72 + Math.random() * 0.26 : 0.35 + Math.random() * 0.35;

        starPhases[i] = Math.random() * Math.PI * 2;
        starTwinkleSpeeds[i] = 0.45 + Math.random() * 0.9;

        const color = Math.random() < 0.72 ? whiteBlue : cyanBlue;

        starColors[i * 3] = color.r;
        starColors[i * 3 + 1] = color.g;
        starColors[i * 3 + 2] = color.b;
    }

    const starsGeometry = new THREE.BufferGeometry();

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(starOpacities, 1));
    starsGeometry.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
    starsGeometry.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(starTwinkleSpeeds, 1));
    starsGeometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));

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
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                float twinkle = 0.5 + 0.5 * sin(
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

                float alpha = (halo * 0.48 + core * 1.2) * vOpacity;

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
        new THREE.BufferAttribute(trailPositions, 3).setUsage(THREE.DynamicDrawUsage),
    );

    trailGeometry.setAttribute(
        'aTrailProgress',
        new THREE.BufferAttribute(new Float32Array([0, 0, 1, 1]), 1),
    );

    trailGeometry.setAttribute(
        'aTrailSide',
        new THREE.BufferAttribute(new Float32Array([-1, 1, -1, 1]), 1),
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

                gl_Position = projectionMatrix *
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
        new THREE.BufferAttribute(headPositions, 3).setUsage(THREE.DynamicDrawUsage),
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

    const shootingGlow = new THREE.Points(shootingHeadGeometry, shootingGlowMaterial);

    const shootingCoreMaterial = new THREE.PointsMaterial({
        color: '#effaff',
        size: 0.085,
        transparent: true,
        opacity: 0.95,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const shootingCore = new THREE.Points(shootingHeadGeometry, shootingCoreMaterial);

    shootingStarGroup.add(trail, shootingGlow, shootingCore);
    scene.add(shootingStarGroup);

    // =========================================================
    // CONTROLE DA ANIMAÇÃO
    // =========================================================

    let elapsedSeconds = 0;
    let nextShootingStarAt = SHOOTING_STAR_INITIAL_DELAY + Math.random() * 2;

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
        const cameraDistance = camera.position.z - SHOOTING_STAR_Z;

        const visibleHeight =
            2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * cameraDistance;

        const visibleWidth = visibleHeight * camera.aspect;
        const startsOnRight = Math.random() < 0.5;

        shootingStart.set(
            (startsOnRight ? 1 : -1) * visibleWidth * 0.46,
            (Math.random() - 0.5) * visibleHeight * 0.65,
            SHOOTING_STAR_Z,
        );

        shootingDirection
            .set(
                startsOnRight ? -0.85 : 0.85,
                (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.35),
                0,
            )
            .normalize();

        shootingStarDuration =
            SHOOTING_STAR_MIN_DURATION +
            Math.random() * (SHOOTING_STAR_MAX_DURATION - SHOOTING_STAR_MIN_DURATION);

        shootingStarDistance = 3.8 + Math.random() * 1.6;
        shootingStarTrailLength = 1.2 + Math.random() * 0.8;

        shootingStarElapsed = 0;
        shootingStarActive = true;
        shootingStarGroup.visible = true;
    };

    const updateShootingStar = (progress: number) => {
        shootingHeadPosition
            .copy(shootingStart)
            .addScaledVector(shootingDirection, shootingStarDistance * progress);

        shootingTailPosition
            .copy(shootingHeadPosition)
            .addScaledVector(shootingDirection, -shootingStarTrailLength);

        shootingPerpendicular
            .set(-shootingDirection.y, shootingDirection.x, 0)
            .multiplyScalar(0.018);

        const positions = trailGeometry.attributes.position.array as Float32Array;

        positions[0] = shootingTailPosition.x + shootingPerpendicular.x;
        positions[1] = shootingTailPosition.y + shootingPerpendicular.y;
        positions[2] = SHOOTING_STAR_Z;

        positions[3] = shootingTailPosition.x - shootingPerpendicular.x;
        positions[4] = shootingTailPosition.y - shootingPerpendicular.y;
        positions[5] = SHOOTING_STAR_Z;

        positions[6] = shootingHeadPosition.x + shootingPerpendicular.x;
        positions[7] = shootingHeadPosition.y + shootingPerpendicular.y;
        positions[8] = SHOOTING_STAR_Z;

        positions[9] = shootingHeadPosition.x - shootingPerpendicular.x;
        positions[10] = shootingHeadPosition.y - shootingPerpendicular.y;
        positions[11] = SHOOTING_STAR_Z;

        trailGeometry.attributes.position.needsUpdate = true;

        shootingHeadGeometry.attributes.position.setXYZ(
            0,
            shootingHeadPosition.x,
            shootingHeadPosition.y,
            SHOOTING_STAR_Z,
        );

        shootingHeadGeometry.attributes.position.needsUpdate = true;

        const fade = Math.sin(Math.PI * progress);

        trailMaterial.uniforms.uOpacity.value = fade;
        shootingGlowMaterial.opacity = 0.4 * fade;
        shootingCoreMaterial.opacity = 0.95 * fade;
    };

    // Atualiza o efeito a cada quadro do renderizador.
    const update = (delta: number, reducedMotion: boolean) => {
        if (reducedMotion) {
            shootingStarGroup.visible = false;
            shootingStarActive = false;
            return;
        }

        elapsedSeconds += delta;
        starsMaterial.uniforms.uTime.value = elapsedSeconds;

        if (!shootingStarActive && elapsedSeconds >= nextShootingStarAt) {
            spawnShootingStar();
        }

        if (shootingStarActive) {
            shootingStarElapsed += delta;

            const progress = THREE.MathUtils.clamp(
                shootingStarElapsed / shootingStarDuration,
                0,
                1,
            );

            updateShootingStar(progress);

            if (progress >= 1) {
                shootingStarActive = false;
                shootingStarGroup.visible = false;

                nextShootingStarAt =
                    elapsedSeconds +
                    SHOOTING_STAR_MIN_INTERVAL +
                    Math.random() * (SHOOTING_STAR_MAX_INTERVAL - SHOOTING_STAR_MIN_INTERVAL);
            }
        }
    };

    // Libera os recursos utilizados pelo efeito.
    const dispose = () => {
        scene.remove(stars, shootingStarGroup);

        starsGeometry.dispose();
        starsMaterial.dispose();

        trailGeometry.dispose();
        trailMaterial.dispose();

        shootingHeadGeometry.dispose();
        shootingGlowMaterial.dispose();
        shootingCoreMaterial.dispose();
    };

    return { update, dispose };
}
