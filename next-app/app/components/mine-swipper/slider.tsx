import React, { useState } from 'react';
import Rectangle from "./rectangle"

const Slider = ({ min, max, initialValue, image, text, onChange } : {min : number, max : number, initialValue : number, image? : string, text : string, onChange: (value: number) => void}) => {
  const [value, setValue] = useState(initialValue);
  const [hover, setHover] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(Number(newValue)); // Assurez-vous que la valeur transmise est un nombre
    }
  };

  return (
    <div className="flex flex-col items-center mt-16">
      {image && <Rectangle content={text} image={image}/>}
      {!image && <Rectangle content={text} />}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-36 h-1.5 appearance-none bg-white rounded-full"
          style={{
            WebkitAppearance: 'none',
          }}
        />
        {hover && (
          <div
            className="absolute bg-white text-black px-2 py-1 rounded-3xl"
            style={{
              top: '30px',
              left: `${(value - min) / (max - min) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {value}
          </div>
        )}
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: black;
            cursor: pointer;
            border-radius: 50%;
          }
          input[type='range']::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: black;
            cursor: pointer;
            border-radius: 50%;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Slider;
