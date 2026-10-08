'use client';

import { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import type { Material } from 'three';

/** This island can fail independently; the server-rendered gradient remains underneath it. */
export function Shield() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let renderer: WebGLRenderer | undefined;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let inView = true;
    let disposed = false;
    let onMove: ((event: MouseEvent) => void) | undefined;
    let onVisibility: (() => void) | undefined;
    let onLost: ((event: Event) => void) | undefined;
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];

    const dispose = () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility);
      if (renderer && onLost) renderer.domElement.removeEventListener('webglcontextlost', onLost);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
    };

    try {
      const scene = new Scene();
      const camera = new PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 1000);
      camera.position.z = 24;
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      // Match r128's linear output without changing Three's global color-management state.
      renderer.outputColorSpace = LinearSRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);
      const group = new Group();
      scene.add(group);
      const color = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);
      const icoGeo = new IcosahedronGeometry(7.2, 2);
      const icoMat = new MeshBasicMaterial({
        color: color(0x6fbd46),
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      const ico = new Mesh(icoGeo, icoMat);
      const coreGeo = new IcosahedronGeometry(4.8, 1);
      const coreMat = new MeshBasicMaterial({
        color: color(0x0c622d),
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const core = new Mesh(coreGeo, coreMat);
      const ring1Geo = new TorusGeometry(9.6, 0.04, 16, 100);
      const ring1Mat = new MeshBasicMaterial({
        color: color(0x6fbd46),
        transparent: true,
        opacity: 0.5,
      });
      const ring1 = new Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 2.3;
      const ring2Geo = new TorusGeometry(8.8, 0.03, 16, 100);
      const ring2Mat = new MeshBasicMaterial({
        color: color(0x2c8a36),
        transparent: true,
        opacity: 0.4,
      });
      const ring2 = new Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 3;
      const particleGeo = new BufferGeometry();
      const coords = new Float32Array(180 * 3);
      for (let index = 0; index < coords.length; index += 3) {
        const radius = 10 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        coords[index] = radius * Math.sin(phi) * Math.cos(theta);
        coords[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
        coords[index + 2] = radius * Math.cos(phi);
      }
      particleGeo.setAttribute('position', new BufferAttribute(coords, 3));
      const particleMat = new PointsMaterial({
        color: color(0x6fbd46),
        size: 0.14,
        transparent: true,
        opacity: 0.75,
      });
      const particles = new Points(particleGeo, particleMat);
      group.add(ico, core, ring1, ring2, particles);
      geometries.push(icoGeo, coreGeo, ring1Geo, ring2Geo, particleGeo);
      materials.push(icoMat, coreMat, ring1Mat, ring2Mat, particleMat);

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let previous = 0;
      let elapsed = 0;
      onMove = (event) => {
        if (!inView) return;
        const rect = host.getBoundingClientRect();
        mouseX = (event.clientX - rect.left - rect.width / 2) * 0.0012;
        mouseY = (event.clientY - rect.top - rect.height / 2) * 0.0012;
      };
      const animate = (time: number) => {
        if (disposed || !inView || document.hidden) {
          frame = 0;
          return;
        }
        const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 1 / 60;
        previous = time;
        elapsed += delta;
        const step = delta * 60;
        const scale = 1 + Math.sin(elapsed * 1.5) * 0.035;
        ico.scale.setScalar(scale);
        core.scale.setScalar(1 / scale);
        ico.rotation.y += 0.004 * step;
        ico.rotation.x += 0.002 * step;
        core.rotation.y -= 0.006 * step;
        ring1.rotation.z += 0.005 * step;
        ring2.rotation.x += 0.004 * step;
        particles.rotation.y += 0.0015 * step;
        const smoothing = 1 - Math.pow(0.95, step);
        targetX += (mouseX - targetX) * smoothing;
        targetY += (mouseY - targetY) * smoothing;
        group.rotation.y = targetX * 1.2;
        group.rotation.x = -targetY * 1.2;
        renderer?.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      const resume = () => {
        if (!disposed && inView && !document.hidden && !frame) {
          previous = 0;
          frame = requestAnimationFrame(animate);
        }
      };
      const pause = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };
      observer = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) resume();
        else pause();
      });
      observer.observe(host);
      resizeObserver = new ResizeObserver(() => {
        if (!host.clientWidth || !host.clientHeight) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer?.setSize(host.clientWidth, host.clientHeight);
      });
      resizeObserver.observe(host);
      onVisibility = () => {
        if (document.hidden) pause();
        else resume();
      };
      onLost = (event) => {
        event.preventDefault();
        dispose();
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      renderer.domElement.addEventListener('webglcontextlost', onLost);
      resume();
    } catch {
      dispose();
      // WebGL is optional. Leave the gradient and all other interactive features operational.
    }
    return dispose;
  }, []);
  return (
    <div
      ref={container}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none opacity-90"
    />
  );
}
