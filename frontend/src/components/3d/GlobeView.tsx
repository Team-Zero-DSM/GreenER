import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

export interface GlobeViewHandle {
    rotateLeft: () => void;
    rotateRight: () => void;
    zoom: (factor: number) => void;
    resetView: () => void;
}

interface GlobeViewProps {
    autoRotate?: boolean;
    progress?: number;
    targetPosition: {
        x: number;
        y: number;
    };
    markers: GlobeMarker[];
}

export interface GlobeMarker {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
}

export const GlobeView = forwardRef<GlobeViewHandle, GlobeViewProps>(function GlobeView(
    { autoRotate = true, progress = 0, targetPosition, markers },
    ref,
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(progress);
    const autoRotateRef = useRef(autoRotate);
    const targetPositionRef = useRef(targetPosition);
    const markersGroupRef = useRef<THREE.Group | null>(null);

    const commandsRef = useRef({
        rotation: 0,
        zoomFactor: 1,
        reset: false,
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
        }),
        [],
    );

    useEffect(() => {
        targetPositionRef.current = targetPosition;
    }, [targetPosition]);

    useEffect(() => {
        progressRef.current = Math.max(0, Math.min(1, progress));
    }, [progress]);

    useEffect(() => {
        autoRotateRef.current = autoRotate;
    }, [autoRotate]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

        camera.position.z = 4.5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        container.appendChild(renderer.domElement);

        const globe = new THREE.Group();
        scene.add(globe);

        const markersGroup = new THREE.Group();
        globe.add(markersGroup);
        markersGroupRef.current = markersGroup;

        const earthTexture = new THREE.TextureLoader().load('/textures/earth.png');

        earthTexture.colorSpace = THREE.SRGBColorSpace;

        const earthMaterial = new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.9,
            metalness: 0,
        });

        const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMaterial);

        globe.add(earth);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.12, 64, 64),
            new THREE.MeshBasicMaterial({
                color: '#0ea5e9',
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide,
            }),
        );

        globe.add(atmosphere);

        scene.add(new THREE.AmbientLight('#ffffff', 1.5));

        const sunlight = new THREE.DirectionalLight('#e0f2fe', 2.5);
        sunlight.position.set(3, 2, 4);
        scene.add(sunlight);

        const starPositions = new Float32Array(1800 * 3);

        for (let i = 0; i < 1800; i++) {
            const radius = 8 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);

            starPositions[i * 3 + 1] = radius * Math.cos(phi);

            starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }

        const starsGeometry = new THREE.BufferGeometry();

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const stars = new THREE.Points(
            starsGeometry,
            new THREE.PointsMaterial({
                color: '#bae6fd',
                size: 0.06,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
            }),
        );

        scene.add(stars);

        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        resizeObserver.observe(container);

        let animationId = 0;
        let previousTime = 0;

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);

            const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;

            previousTime = time;

            const commands = commandsRef.current;

            if (commands.reset) {
                globe.rotation.set(0, 0, 0);
                camera.position.z = 4.5;
                commands.rotation = 0;
                commands.zoomFactor = 1;
                commands.reset = false;
            }

            const rotationStep = commands.rotation * Math.min(delta * 6, 1);

            globe.rotation.y += rotationStep;
            commands.rotation -= rotationStep;

            if (Math.abs(commands.rotation) < 0.001) {
                commands.rotation = 0;
            }

            if (commands.zoomFactor !== 1) {
                camera.position.z = THREE.MathUtils.clamp(
                    camera.position.z / commands.zoomFactor,
                    2.5,
                    8,
                );

                commands.zoomFactor = 1;
            }

            const p = progressRef.current;
            const smooth = p * p * (3 - 2 * p);

            const width = container.clientWidth;
            const height = container.clientHeight;

            const startScale = 1.65;
            const endScale = 1.45;

            globe.scale.setScalar(THREE.MathUtils.lerp(startScale, endScale, smooth));

            const visibleHeight =
                2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;

            const target = targetPositionRef.current;

            const horizontalOffset = 60;

            const targetX = ((target.x - horizontalOffset - width / 2) / height) * visibleHeight;

            const targetY = -((target.y - height / 2) / height) * visibleHeight;

            globe.position.x = THREE.MathUtils.lerp(0, targetX, smooth);

            globe.position.y = THREE.MathUtils.lerp(0, targetY, smooth);

            if (autoRotateRef.current) {
                globe.rotation.y += delta * 0.2;
            }

            stars.rotation.y += delta * 0.004;

            renderer.render(scene, camera);
        };

        animate(0);

        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();

            earth.geometry.dispose();
            earthMaterial.dispose();
            earthTexture.dispose();

            atmosphere.geometry.dispose();
            (atmosphere.material as THREE.Material).dispose();

            starsGeometry.dispose();
            (stars.material as THREE.Material).dispose();

            markersGroupRef.current = null;
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

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

            const color =
                marker.status === 'available'
                    ? '#22c55e'
                    : marker.status === 'unavailable'
                      ? '#ef4444'
                      : '#f59e0b';

            const material = new THREE.MeshBasicMaterial({ color });
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

    return (
        <div
            ref={containerRef}
            className="h-full w-full"
            aria-label="Globo 3D do GreenER"
            role="img"
        />
    );
});
