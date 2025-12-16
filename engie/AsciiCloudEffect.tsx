"use client";

import { useCallback, useEffect, useRef } from "react";
import { isDesktop } from "react-device-detect";
import * as THREE from "three";

// ============================================
// ASCII Characters Texture Generator
// ============================================
function createASCIITexture() {
  const chars = " .:-=+*#%@";
  const charWidth = 50;
  const charHeight = 84;
  const canvas = document.createElement("canvas");
  canvas.width = charWidth * chars.length;
  canvas.height = charHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 72px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], charWidth * i + charWidth / 2, charHeight / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return { texture, spriteCount: chars.length };
}

// ============================================
// Easing Functions
// ============================================
const ease = {
  cubicInOut: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  backOut: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  expoInOut: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

function fit(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  easeFunc?: (t: number) => number
) {
  let t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  if (easeFunc) t = easeFunc(t);
  return outMin + (outMax - outMin) * t;
}

interface MeshItem {
  mesh: THREE.Mesh;
  cloudIndex?: number;
  layerIndex?: number;
  delay: number;
  isRod?: boolean;
}

interface CloudItem {
  mesh: THREE.Mesh;
  container: THREE.Object3D;
  delay: number;
}

interface AsciiCloudEffectProps {
  className?: string;
  backgroundColor?: string;
}

export default function AsciiCloudEffect({
  className = "",
  backgroundColor = "#0a0d14",
}: AsciiCloudEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const startTimeRef = useRef(0);
  const meshListRef = useRef<MeshItem[]>([]);
  const cloudsRef = useRef<THREE.Object3D[]>([]);
  const rodsRef = useRef<CloudItem[]>([]);

  const initVoxelLogo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Colors - brighter cloud color
    const color = new THREE.Color("#6d7994");
    const bgColor = new THREE.Color("#0f131c");

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

    // Scene
    const scene = new THREE.Scene();

    // Camera (Orthographic for isometric view)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 5;
    scene.add(camera);

    // Light position (follows mouse)
    const lightPosition = new THREE.Vector3(2, 2, 2);

    // Render targets for pixelation
    const pixelScale = isDesktop ? 2 : 1.2;
    const highRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
    });
    const lowRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    // ASCII texture
    const { texture: asciiTexture, spriteCount } = createASCIITexture();

    // Mesh material with lighting (for clouds - blue)
    const meshMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: lightPosition },
      },
      vertexShader: `
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
        varying vec3 v_viewNormal;
        
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          v_viewNormal = normalMatrix * normal;
          v_worldNormal = normalize((vec4(v_viewNormal, 0.0) * viewMatrix).xyz);
          v_worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        }
      `,
      fragmentShader: `
        uniform vec3 u_lightPosition;
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
        varying vec3 v_viewNormal;
        
        void main() {
          vec3 VN = normalize(v_viewNormal);
          vec3 N = normalize(v_worldNormal);
          vec3 L = normalize(u_lightPosition - v_worldPosition);
          
          float shade1 = max(0.0, dot(N, L)) / (length(u_lightPosition - v_worldPosition) * 0.3);
          float shade2 = max(0.0, dot(VN, vec3(0.5773)));
          
          // Increase overall brightness
          float brightness = 0.4 + shade1 * 0.8 + shade2 * 0.6;
          gl_FragColor = vec4(brightness, brightness * 1.2, brightness * 1.5, 1.0);
        }
      `,
    });

    // Rod material (BRIGHT cyan/white for data connections)
    const rodMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_lightPosition: { value: lightPosition },
      },
      vertexShader: `
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
        varying vec3 v_viewNormal;
        
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          v_viewNormal = normalMatrix * normal;
          v_worldNormal = normalize((vec4(v_viewNormal, 0.0) * viewMatrix).xyz);
          v_worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        }
      `,
      fragmentShader: `
        uniform vec3 u_lightPosition;
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
        varying vec3 v_viewNormal;
        
        void main() {
          vec3 VN = normalize(v_viewNormal);
          vec3 N = normalize(v_worldNormal);
          vec3 L = normalize(u_lightPosition - v_worldPosition);
          
          float shade1 = max(0.0, dot(N, L)) / (length(u_lightPosition - v_worldPosition) * 0.4);
          float shade2 = max(0.0, dot(VN, vec3(0.5773)));
          
          // Bright glow effect
          float brightness = 0.5 + shade1 * 0.3 + shade2 * 0.3;
          gl_FragColor = vec4(brightness * 0.5, brightness * 0.7, brightness, 1.0);
        }
      `,
    });

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Logo container
    const logoContainer = new THREE.Object3D();
    const logoOuterContainer = new THREE.Object3D();

    // Cloud positions (triangle formation)
    const scaleModifier = isDesktop ? 1 : 0.85;
    const cloudPositions = [
      { x: 0, y: 1.4, z: 0, scale: 1.5 * scaleModifier }, // Top cloud (large)
      { x: -1.6, y: -1.6, z: 0.6, scale: 1.1 * scaleModifier }, // Bottom-left cloud (LOWER)
      { x: 1.6, y: -0.8, z: -0.4, scale: 1.2 * scaleModifier }, // Bottom-right cloud
    ];

    // Store cloud containers for animation
    const clouds: THREE.Object3D[] = [];
    const rods: CloudItem[] = [];
    const meshList: MeshItem[] = [];

    // Create cloud function
    const createCloud = (
      geometry: THREE.BoxGeometry,
      scale: number,
      cloudIndex: number
    ) => {
      const cloud = new THREE.Object3D();

      // Cloud shape: stacked layers creating isometric 3D cloud effect
      const layers = [
        // Bottom layer (darkest - back)
        {
          y: -0.4,
          cubes: [
            [-0.3, 0],
            [0.3, 0],
            [0, 0.3],
            [0, -0.3],
          ],
        },
        // Middle-back layer
        {
          y: -0.2,
          cubes: [
            [-0.5, 0],
            [0.5, 0],
            [0, 0],
            [-0.25, 0.25],
            [0.25, 0.25],
            [-0.25, -0.25],
            [0.25, -0.25],
          ],
        },
        // Middle layer
        {
          y: 0,
          cubes: [
            [-0.6, 0],
            [0.6, 0],
            [0, 0],
            [-0.3, 0],
            [0.3, 0],
            [0, 0.3],
            [0, -0.3],
            [-0.3, 0.3],
            [0.3, 0.3],
          ],
        },
        // Top layer (brightest - front)
        {
          y: 0.2,
          cubes: [
            [-0.4, 0],
            [0.4, 0],
            [0, 0],
            [-0.2, 0.2],
            [0.2, 0.2],
          ],
        },
        // Peak
        {
          y: 0.4,
          cubes: [
            [0, 0],
            [-0.2, 0],
            [0.2, 0],
          ],
        },
      ];

      const cubeSize = 0.32 * scale;

      layers.forEach((layer, layerIndex) => {
        layer.cubes.forEach((cubePos, cubeIndex) => {
          const container = new THREE.Object3D();
          const mesh = new THREE.Mesh(geometry, meshMaterial);

          container.position.set(
            cubePos[0] * scale,
            layer.y * scale,
            cubePos[1] * scale
          );
          container.scale.setScalar(cubeSize);
          container.add(mesh);
          cloud.add(container);

          meshList.push({
            mesh,
            cloudIndex,
            layerIndex,
            delay: cloudIndex * 0.3 + layerIndex * 0.05 + cubeIndex * 0.02,
          });
        });
      });

      return cloud;
    };

    // Create rod function
    const createRod = (
      from: (typeof cloudPositions)[0],
      to: (typeof cloudPositions)[0]
    ) => {
      // Calculate direction and length
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dz = to.z - from.z;
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Create rod mesh
      const mesh = new THREE.Mesh(boxGeometry, rodMaterial);
      const container = new THREE.Object3D();

      // Position at midpoint
      container.position.set(
        (from.x + to.x) / 2,
        (from.y + to.y) / 2,
        (from.z + to.z) / 2
      );

      // Scale to create VISIBLE rod (thicker)
      container.scale.set(0.1, 0.1, length * 0.8);

      // Rotate to point from -> to
      container.lookAt(to.x, to.y, to.z);

      container.add(mesh);
      logoContainer.add(container);

      rods.push({
        mesh,
        container,
        delay: 1.5,
      });
      meshList.push({
        mesh,
        isRod: true,
        delay: 1.5,
      });
    };

    // Create clouds (lighter scales on mobile)
    cloudPositions.forEach((pos, index) => {
      const cloud = createCloud(boxGeometry, pos.scale, index);
      cloud.position.set(pos.x, pos.y, pos.z);
      logoContainer.add(cloud);
      clouds.push(cloud);
    });

    // Create connecting rods between clouds
    createRod(cloudPositions[0], cloudPositions[1]); // Top to Bottom-left
    createRod(cloudPositions[0], cloudPositions[2]); // Top to Bottom-right
    createRod(cloudPositions[1], cloudPositions[2]); // Bottom-left to Bottom-right

    logoContainer.scale.setScalar(0.38);
    logoOuterContainer.add(logoContainer);
    scene.add(logoOuterContainer);

    // Store references
    meshListRef.current = meshList;
    cloudsRef.current = clouds;
    rodsRef.current = rods;

    // Full-screen quad for post processing
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    const postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_sceneTexture: { value: lowRenderTarget.texture },
        u_sceneTextureSize: { value: new THREE.Vector2(1, 1) },
        u_texture: { value: asciiTexture },
        u_textureSpriteCount: { value: spriteCount },
        u_bgColor: { value: bgColor },
        u_color: { value: color },
        u_mouseXY: { value: new THREE.Vector2(0, 0) },
        u_resolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 v_uv;
        void main() {
          v_uv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        
        uniform sampler2D u_sceneTexture;
        uniform vec2 u_sceneTextureSize;
        uniform sampler2D u_texture;
        uniform float u_textureSpriteCount;
        uniform vec3 u_bgColor;
        uniform vec3 u_color;
        uniform vec2 u_mouseXY;
        uniform vec2 u_resolution;
        
        varying vec2 v_uv;
        
        void main() {
          vec2 pixelXY = v_uv * u_sceneTextureSize;
          vec2 uv = fract(pixelXY);
          
          vec3 pixelRGB = texture2D(u_sceneTexture, floor(pixelXY) / u_sceneTextureSize).rgb;
          float luma = max(pixelRGB.g, (1.0 - pixelRGB.b) * 0.55);
          
          float spriteIndex = floor(min(u_textureSpriteCount * luma, u_textureSpriteCount - 1.0));
          vec2 spriteUV = vec2((uv.x + spriteIndex) / u_textureSpriteCount, uv.y);
          
          float sprite = texture2D(u_texture, spriteUV).g;
          
          float dist = length(u_mouseXY - vec2(v_uv.x, 1.0 - v_uv.y) * u_resolution);
          float distRatio = smoothstep(0.8, 0.0, dist / u_resolution.y) * pixelRGB.r;
          
          // Avoid mipmap artifacts
          vec2 fw = fwidth(uv);
          sprite *= 1.0 - min(1.0, fw.x + fw.y);
          sprite = smoothstep(0.0, 1.0, sprite * 1.5);
          
          gl_FragColor = vec4(mix(u_bgColor, min(vec3(1.0), u_color * (0.9 + distRatio * 2.0)), sprite), 1.0);
        }
      `,
    });

    const postQuad = new THREE.Mesh(quadGeometry, postMaterial);

    // Copy texture function
    const copyTexture = () => {
      const copyMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: highRenderTarget.texture },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(tDiffuse, vUv);
          }
        `,
      });

      const copyQuad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        copyMaterial
      );

      renderer.setRenderTarget(lowRenderTarget);
      renderer.render(copyQuad, camera);

      copyMaterial.dispose();
      copyQuad.geometry.dispose();
    };

    // Resize function
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate pixel dimensions for ASCII effect
      const pixelSize = fit(height, 400, 1000, 14, 24);
      const pixelHeight = Math.ceil(height / pixelSize);
      const pixelWidth = Math.ceil(width / ((pixelSize * 50) / 84));

      // Update render targets
      lowRenderTarget.setSize(pixelWidth, pixelHeight);
      highRenderTarget.setSize(
        pixelWidth * pixelScale,
        pixelHeight * pixelScale
      );

      // Update uniforms
      postMaterial.uniforms.u_sceneTextureSize.value.set(
        pixelWidth,
        pixelHeight
      );

      // Update renderer
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setSize(width * dpr, height * dpr, false);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Update camera
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();

      // Default mouse to center
      mouseXRef.current = width / 2;
      mouseYRef.current = height / 2;

      // Update post material resolution
      postMaterial.uniforms.u_resolution.value.set(width, height);
    };

    // Animation function
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const t = elapsed * 0.6; // Animation speed

      // Update mouse uniforms
      postMaterial.uniforms.u_mouseXY.value.set(
        mouseXRef.current,
        mouseYRef.current
      );

      // Update light position based on mouse
      const rect = canvas.getBoundingClientRect();
      const normalizedX = (mouseXRef.current / rect.width) * 2 - 1;
      const normalizedY = 1 - (mouseYRef.current / rect.height) * 2;

      const vec = new THREE.Vector3(normalizedX, normalizedY, 0.5);
      vec.unproject(camera);
      vec.z = 5;
      lightPosition.copy(vec);

      // Animate individual cubes/meshes - FASTER appearance
      for (let i = 0; i < meshListRef.current.length; i++) {
        const item = meshListRef.current[i];
        const delay = (item.delay || i * 0.03) * 0.3; // 3x faster
        const scale = fit(t, delay, delay + 0.2, 0, 1, ease.backOut);
        item.mesh.scale.setScalar(scale);
      }

      // Clouds appear FAST and ROTATE in place
      if (cloudsRef.current) {
        cloudsRef.current.forEach((cloud, index) => {
          // FASTER drop-in animation
          const dropDelay = index * 0.15;
          const dropProgress = fit(
            t,
            dropDelay,
            dropDelay + 0.4,
            0,
            1,
            ease.backOut
          );
          cloud.scale.setScalar(dropProgress);

          // Self-rotation - each cloud rotates at different speed
          const rotSpeed = 0.3 + index * 0.15;
          cloud.rotation.y = elapsed * rotSpeed;

          // Slight tilt variation
          cloud.rotation.x = Math.sin(elapsed * 0.5 + index) * 0.1;
        });
      }

      // Occasional container full rotation (every 8 seconds)
      const rotationCycle = 8; // seconds
      const cycleProgress = (elapsed % rotationCycle) / rotationCycle;

      // Rotate smoothly during middle portion of cycle
      let containerRotation = 0;
      if (cycleProgress > 0.3 && cycleProgress < 0.7) {
        // Map 0.3-0.7 to 0-1, then to 0-2π
        const rotProgress = (cycleProgress - 0.3) / 0.4;
        containerRotation = ease.cubicInOut(rotProgress) * Math.PI * 2;
      } else if (cycleProgress >= 0.7) {
        containerRotation = Math.PI * 2; // Hold at full rotation briefly
      }

      logoContainer.rotation.y = containerRotation;

      // Fixed scale
      logoContainer.scale.setScalar(0.38);

      // Fixed outer container rotation (isometric view) - shifted MORE RIGHT
      logoOuterContainer.rotation.set(-0.5, Math.PI * 0.2, 0.1);
      logoOuterContainer.position.set(1.0, 0, 0);

      // Render to high-res target
      renderer.setRenderTarget(highRenderTarget);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(scene, camera);

      // Copy to low-res target (pixelation)
      copyTexture();

      // Render final output with ASCII effect
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(postQuad, camera);

      requestAnimationFrame(animate);
    };

    return {
      renderer,
      scene,
      camera,
      resize,
      animate,
      lightPosition,
      logoContainer,
      logoOuterContainer,
      postMaterial,
      cleanup: () => {
        // Cleanup resources
        renderer.dispose();
        boxGeometry.dispose();
        meshMaterial.dispose();
        rodMaterial.dispose();
        postMaterial.dispose();
        quadGeometry.dispose();
        highRenderTarget.dispose();
        lowRenderTarget.dispose();
        asciiTexture.dispose();
      },
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    startTimeRef.current = Date.now();
    const voxelLogo = initVoxelLogo();
    if (!voxelLogo) return;

    // Event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
      mouseYRef.current = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = rect.width / 2;
      mouseYRef.current = rect.height / 2;
    };

    const handleResize = () => {
      voxelLogo.resize();
    };

    // Bind events
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Initial resize and start animation
    voxelLogo.resize();
    voxelLogo.animate();

    // Cleanup
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      voxelLogo.cleanup();
    };
  }, [initVoxelLogo]);

  return (
    // <div

    //      className={`relative inset-0  h-full overflow-hidden  w-screen `}>

    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{
        backgroundColor,
        cursor: "crosshair",
      }}
    />
    // </div>
  );
}
