import React from 'react';

const AdminBox = ({
  title,
  children,
  width = 'flex-1',
  minHeight = '160px'
}) => {
  return (
    <div className={`${width} bg-white rounded-[10px] p-6 shadow-md`} style={{ minHeight }}>
      <h2 className="justify-start text-black/80 text-xl font-semibold font-['Inter']">{title}</h2>
      <div className="w-full h-0 outline-2 outline-offset-[-1px] outline-purple-800 my-4"></div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default AdminBox;
