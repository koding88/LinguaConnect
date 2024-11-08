import React from 'react'

const ListImage = ({ ...props }) => {
    if (!props?.images?.length) return null;

    return (
        <div className="mb-4 max-w-full overflow-hidden">
            <div className={`flex ${props?.images?.length > 1 ? 'overflow-x-auto space-x-2' : ''}`}>
                {props?.images?.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className={`h-auto max-h-[250px] object-contain rounded-[6px] ${props?.images?.length === 1 ? 'w-full' : 'w-[48%] flex-shrink-0'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListImage
