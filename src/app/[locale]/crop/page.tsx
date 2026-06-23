'use client';
import { useState, useRef, useEffect } from 'react';

export default function CropPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [currentPos, setCurrentPos] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const img = new window.Image();
    img.src = '/ナタク.png';
    img.onload = () => {
      setImageObj(img);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.onerror = () => {
      setStatus('画像が見つかりません。public/ナタク.pngに画像があるか確認してください。');
    };
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageObj) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0);

    if (startPos && currentPos) {
      // Create a square
      const size = Math.max(Math.abs(currentPos.x - startPos.x), Math.abs(currentPos.y - startPos.y));
      const width = currentPos.x < startPos.x ? -size : size;
      const height = currentPos.y < startPos.y ? -size : size;
      
      ctx.strokeStyle = '#ef4444'; // red-500
      ctx.lineWidth = 4;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
      // semi transparent overlay
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, startPos.y); // top
      ctx.fillRect(0, startPos.y, startPos.x, canvas.height - startPos.y); // left
      ctx.fillRect(startPos.x + width, startPos.y, canvas.width - (startPos.x + width), canvas.height - startPos.y); // right
      ctx.fillRect(startPos.x, startPos.y + height, width, canvas.height - (startPos.y + height)); // bottom
    }
  };

  useEffect(() => {
    redraw();
  }, [startPos, currentPos]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    setStartPos(pos);
    setCurrentPos(pos);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setCurrentPos(getCanvasCoords(e));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const saveCrop = async () => {
    if (!startPos || !currentPos || !imageObj) return;
    setStatus('保存中...');
    
    const size = Math.max(Math.abs(currentPos.x - startPos.x), Math.abs(currentPos.y - startPos.y));
    const sx = Math.min(startPos.x, currentPos.x < startPos.x ? startPos.x - size : startPos.x);
    const sy = Math.min(startPos.y, currentPos.y < startPos.y ? startPos.y - size : startPos.y);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tCtx = tempCanvas.getContext('2d');
    tCtx?.drawImage(imageObj, sx, sy, size, size, 0, 0, size, size);
    
    const dataUrl = tempCanvas.toDataURL('image/png');
    
    try {
      const res = await fetch('/api/crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      });
      if (res.ok) {
        setStatus('保存完了！ナタクのページに戻ってリロードしてください。');
      } else {
        setStatus('エラーが発生しました。');
      }
    } catch (e) {
      setStatus('エラーが発生しました。');
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">スキル4のアイコンを四角く囲んでください</h1>
      <div className="flex gap-4 mb-4 items-center">
        <button onClick={saveCrop} className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-500">
          この範囲で切り取って保存
        </button>
        <span className="text-yellow-400 font-bold">{status}</span>
      </div>
      <p className="mb-4 text-gray-400 text-sm">ドラッグしてアイコンを四角く囲んでください（正方形に自動調整されます）</p>
      <div className="border-4 border-gray-700 overflow-auto max-w-full" style={{ maxHeight: '80vh' }}>
        <canvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
