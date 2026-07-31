"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const brass = new THREE.MeshStandardMaterial({
      color: 0xc9a15a,
      wireframe: true,
      metalness: 0.9,
      roughness: 0.25,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0x5c8ac4,
      wireframe: true,
      metalness: 0.9,
      roughness: 0.3,
    });

    const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), brass);
    group.add(icosa);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.02, 8, 120), steel);
    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.02, 8, 120), brass);
    ring2.rotation.x = -Math.PI / 2.8;
    ring2.rotation.y = Math.PI / 6;
    group.add(ring2);

    const particlesGeo = new THREE.BufferGeometry();
    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeo,
      new THREE.PointsMaterial({ color: 0x5c8ac4, size: 0.03, transparent: true, opacity: 0.8 })
    );
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xc9a15a, 1.2);
    light.position.set(2, 3, 4);
    scene.add(light);

    let mouseX = 0;
    let mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      group.rotation.y += 0.0035;
      group.rotation.x += 0.0012;
      icosa.rotation.y -= 0.004;
      particles.rotation.y -= 0.0006;
      group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.02;
      group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
