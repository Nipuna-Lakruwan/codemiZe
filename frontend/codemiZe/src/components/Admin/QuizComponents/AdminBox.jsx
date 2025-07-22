import React from 'react';

const AdminBox = ({
  title,
  children,
  width = 'flex-1',
  minHeight = '160px',
  customClass = ''
}) => {
  return (
    <div className={`${width} bg-white rounded-[10px] p-4 shadow-md ${customClass}`} style={{ minHeight: minHeight.startsWith('h-') ? 'auto' : minHeight }}>
      <h2 className="justify-start text-black/80 text-xl font-semibold font-['Inter']">{title}</h2>
      

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default AdminBox;
