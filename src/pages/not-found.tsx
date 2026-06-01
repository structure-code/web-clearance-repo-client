import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-height-screen w-full min-h-screen bg-[#ececec] select-none font-sans">
      <div className="relative flex items-center justify-center w-[30em] height-[30em]">
        
        {/* Main TV Container */}
        <div className="relative flex flex-col items-center justify-center mt-[5em] z-10">
          
          {/* Antenna Group */}
          <div className="relative w-[5em] height-[5em] h-[5em] rounded-full border-2 border-black bg-[#f27405] mb-[-6em] z-[-1]
            after:content-[''] after:absolute after:mt-[-9.4em] after:ml-[0.4em] after:rotate-[-25deg] after:w-[1em] after:h-[0.5em] after:rounded-full after:bg-[#f69e50]
            before:content-[''] before:absolute before:mt-[0.2em] before:ml-[1.25em] before:rotate-[-20deg] before:w-[1.5em] before:h-[0.8em] before:rounded-full before:bg-[#f69e50]">
            <div className="absolute bg-transparent w-12.5 h-14 ml-[1.68em] rounded-[45%] rotate-140 border-4 border-transparent shadow-[inset_0px_16px_#a85103,inset_0px_16px_1px_1px_#a85103]" />
            
            {/* Left Antenna Rod */}
            <div 
              className="relative top-[-102%] left-[-130%] w-[12em] h-[5.5em] rounded-[50px] bg-linear-to-b from-[#171717] via-[#353535] to-[#171717] rotate-[-29deg]"
              style={{ clipPath: 'polygon(50% 0%, 49% 100%, 52% 100%)' }}
            />
            <div className="relative top-[-211%] left-[-35%] rotate-45 w-[0.5em] h-[0.5em] rounded-full border-2 border-black bg-[#979797] z-99" />
            
            {/* Right Antenna Rod */}
            <div 
              className="relative top-[-210%] left-[-10%] w-[12em] h-[4em] rounded-[50px] bg-linear-to-b from-[#171717] via-[#353535] to-[#171717] mr-[5em] rotate-[-8deg]"
              style={{ clipPath: 'polygon(47% 0, 47% 0, 34% 34%, 54% 25%, 32% 100%, 29% 96%, 49% 32%, 30% 38%)' }}
            />
            <div className="relative top-[-294%] left-[94%] w-[0.5em] h-[0.5em] rounded-full border-2 border-black bg-[#979797] z-99" />
          </div>

          {/* TV Body */}
          <div className="relative w-[17em] h-[9em] mt-[3em] rounded-[15px] bg-[#d36604] flex justify-center border-2 border-[#1d0e01] shadow-[inset_0.2em_0.2em_#e69635]
            after:content-[''] after:absolute after:inset-0 after:rounded-[13px] after:bg-difference after:opacity-10 after:pointer-events-none"
            style={{
              backgroundImage: 'repeating-radial-gradient(#d36604 0px, #00000070 2px), repeating-conic-gradient(#d36604 0px, #00000070 2px)'
            }}>
            
            {/* Decorative Vector Curve */}
            <div className="absolute top-[0.25em] left-[0.25em] h-3 width-[12px]">
              <svg className="h-3 w-3 fill-black" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189.929 189.929">
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
              </svg>
            </div>

            {/* Display / Screen Wrapper */}
            <div className="flex items-center align-self-center justify-center rounded-[15px] shadow-[3.5px_3.5px_0px_#e69635] ml-[-1em] self-center">
              <div className="w-[11em] h-[7.75em] flex items-center justify-center rounded-[10px]">
                
                {/* Desktop Screen (Static Noise Animation) */}
                <div 
                  className="hidden lg:flex w-[11em] h-[7.75em] font-sans border-2 border-[#1d0e01] bg-difference animate-[noise_0.2s_infinite_alternate] rounded-[10px] z-99 items-center justify-center font-bold color-[#252525] tracking-[0.15em] text-center"
                  style={{
                    background: 'repeating-radial-gradient(#000 0 0.0001%, #fff 0 0.0002%) 50% 0/2500px 2500px, repeating-conic-gradient(#000 0 0.0001%, #fff 0 0.0002%) 60% 60%/2500px 2500px'
                  }}>
                  <span className="bg-black px-2 py-0.5 text-[0.75em] text-white tracking-normal rounded-[5px] z-10">NOT FOUND</span>
                </div>

                {/* Mobile / Tablet Screen (SMPTE Color Bars) */}
                <div 
                  className="flex lg:hidden w-[11em] h-[7.75em] relative font-sans rounded-[10px] border-2 border-black z-99 items-center justify-center font-bold text-[#252525] tracking-[0.15em] text-center overflow-hidden
                    before:content-[''] before:absolute before:top-0 before:left-0 before:z-1 before:w-full before:h-[68.4%]
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:z-1 after:w-full after:h-[21.7%]"
                  style={{
                    background: 'linear-gradient(to right, #002fc6 0%, #002bb2 14.28%, #3a3a3a 14.28%, #303030 28.57%, #ff0afe 28.57%, #f500f4 42.85%, #6c6c6c 42.85%, #626262 57.14%, #0affd9 57.14%, #00f5ce 71.42%, #3a3a3a 71.42%, #303030 85.71%, white 85.71%, #fafafa 100%)',
                    backgroundImage: 'none' // safety override
                  }}>
                  {/* Top color bars container overlay styling */}
                  <div className="absolute top-0 left-0 w-full h-[68.4%] z-1" style={{ background: 'linear-gradient(to right, white 0%, #fafafa 14.28%, #ffe60a 14.28%, #f5dc00 28.57%, #0affd9 28.57%, #00f5ce 42.85%, #10ea00 42.85%, #0ed600 57.14%, #ff0afe 57.14%, #f500f4 71.42%, #ed0014 71.42%, #d90012 85.71%, #002fc6 85.71%, #002bb2 100%)' }} />
                  {/* Bottom color bars container overlay styling */}
                  <div className="absolute bottom-0 left-0 w-full h-[21.7%] z-1" style={{ background: 'linear-gradient(to right, #006c6b 0%, #005857 16.66%, white 16.66%, #fafafa 33.33%, #001b75 33.33%, #001761 50%, #6c6c6c 50%, #626262 66.66%, #929292 66.66%, #888888 83.33%, #3a3a3a 83.33%, #303030 100%)' }} />
                  
                  <span className="bg-black px-2 py-0.5 text-[0.75em] text-white tracking-normal rounded-[5px] z-10">NOT FOUND</span>
                </div>

              </div>
            </div>

            {/* Vintage Base Line Detail */}
            <div className="absolute bottom-[0.5em] left-[2em] flex gap-[0.1em] items-end">
              <div className="w-0.5 h-[0.5em] bg-black rounded-t-[25px]" />
              <div className="w-0.5 h-[1em] bg-black rounded-t-[25px]" />
              <div className="w-0.5 h-[0.5em] bg-black rounded-t-[25px]" />
            </div>

            {/* Control Panel Knobs & Speakers */}
            <div className="w-[4.25em] h-[8em] bg-[#e69635] border-2 border-[#1d0e01] p-[0.6em] rounded-[10px] flex flex-col items-center justify-center gap-[0.5em] shadow-[3px_3px_0px_#e69635] ml-[0.5em] self-center">
              
              {/* Knob 1 */}
              <div className="relative w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black]
                before:content-[''] before:absolute before:top-[0.9em] before:left-[0.3em] before:rotate-47 before:rounded-[5px] before:w-[0.1em] before:h-[0.4em] before:bg-black">
                <div className="absolute top-[0.05em] left-[0.65em] rotate-45 w-[0.15em] h-[1.3em] bg-black" />
              </div>

              {/* Knob 2 */}
              <div className="relative w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black shadow-[inset_2px_2px_1px_#b49577,-2px_0px_#513721,-2px_0px_0px_1px_black]
                before:content-[''] before:absolute before:top-[0.9em] before:left-[0.6em] before:-rotate-45 before:rounded-[5px] before:w-[0.15em] before:h-[0.4em] before:bg-black
                after:content-[''] after:absolute after:top-[0.05em] after:left-[0.65em] after:-rotate-45 after:w-[0.15em] after:h-[1.3em] after:bg-black" />

              {/* Speakers */}
              <div className="flex flex-col gap-[0.4em] w-full items-center">
                <div className="flex gap-[0.25em]">
                  <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#7f5934] border border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                  <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#7f5934] border border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                  <div className="w-[0.5em] h-[0.5em] rounded-full bg-[#7f5934] border border-black shadow-[inset_1.25px_1.25px_1px_#b49577]" />
                </div>
                <div className="w-[2em] h-0.5 bg-[#171717]" />
                <div className="w-[2em] h-0.5 bg-[#171717]" />
              </div>

            </div>
          </div>

          {/* TV Stand Feet */}
          <div className="w-full flex items-center justify-center gap-[8.7em]">
            <div className="h-[1em] w-[2em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]" />
            <div className="h-[1em] w-[2em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]" />
            <div className="absolute h-[0.15em] w-[17.5em] bg-[#171717] mt-[0.8em]" />
          </div>

        </div>

        {/* Jumbo Background 404 Text */}
        <div className="absolute flex flex-row gap-[4em] md:gap-[6em] z-0 opacity-15 font-sans font-black color-black pointer-events-none">
          <div className="scale-y-[24.5] scale-x-[9]">4</div>
          <div className="scale-y-[24.5] scale-x-[9]">0</div>
          <div className="scale-y-[24.5] scale-x-[9]">4</div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;