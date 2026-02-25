import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars = [];
        const numStars = 600;

        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = width / 2;
        let targetMouseY = height / 2;

        const handleMouseMove = (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        class Star {
            constructor() {
                this.x = (Math.random() - 0.5) * width * 2;
                this.y = (Math.random() - 0.5) * height * 2;
                this.z = Math.random() * width;
                this.pz = this.z;
                this.color = ['#FFFFFF', '#F3F4F6', '#D1D5DB', '#9CA3AF'][Math.floor(Math.random() * 4)];
            }

            update() {
                this.pz = this.z;
                // Base speed plus speed mapped from how far mouse is from center for interactivity
                const dx = targetMouseX - width / 2;
                const dy = targetMouseY - height / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);
                let speed = 1.5 + (dist / width) * 12;
                this.z -= speed;

                if (this.z < 1) {
                    this.z = width;
                    this.x = (Math.random() - 0.5) * width * 2;
                    this.y = (Math.random() - 0.5) * height * 2;
                    this.pz = this.z;
                }
            }

            draw() {
                // Shift the origin based on mouse movement (parallax effect)
                const cx = width / 2 + (mouseX - width / 2) * 0.08;
                const cy = height / 2 + (mouseY - height / 2) * 0.08;

                const sx = (this.x / this.z) * width + cx;
                const sy = (this.y / this.z) * height + cy;

                const px = (this.x / this.pz) * width + cx;
                const py = (this.y / this.pz) * height + cy;

                const size = Math.max(0.1, (1 - this.z / width) * 2.5);

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);

                ctx.lineWidth = size;
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = Math.max(0, 1 - this.z / width);
                ctx.stroke();
            }
        }

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        let animationFrameId;

        const animate = () => {
            // Smooth interpolation for mouse movement
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;

            // Trail effect with deep black background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                stars[i].update();
                stars[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};

export default ParticleBackground;
