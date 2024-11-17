const ListImage = ({ ...props }) => {
    if (!props?.images?.length) return null;

    return (
        <div className="mb-4 max-w-full overflow-x-auto overflow-y-hidden">
            <div className={`flex ${props?.images?.length > 1 ? 'flex-col md:flex-row gap-2 md:gap-4' : 'justify-center'}`}>
                {props?.images?.map((image, index) => (
                    <div
                        key={index}
                        className={`relative group ${
                            props?.images?.length === 1
                                ? 'w-[80%] max-w-3xl'
                                : props?.images?.length === 2
                                    ? 'w-full md:w-[48%]'
                                    : index % 2 === 0
                                        ? 'w-full md:w-[45%] flex-shrink-0'
                                        : 'w-full md:w-[45%] flex-shrink-0 ml-auto'
                        }`}
                    >
                        <img
                            loading="lazy"
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className={`
                                ${props?.images?.length === 1 ? 'h-[400px]' : 'h-[200px] md:h-[300px]'}
                                w-full object-cover rounded-lg
                                transition-all duration-300 ease-in-out
                                group-hover:scale-[1.02] group-hover:shadow-xl
                                cursor-pointer
                            `}
                        />
                        <div className="
                            absolute inset-0
                            bg-gradient-to-t from-black/50 via-black/20 to-transparent
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300
                            rounded-lg
                        "/>
                        <div className="
                            absolute bottom-3 left-3
                            text-white text-sm font-medium
                            hidden md:block md:opacity-0 md:group-hover:opacity-100
                            transition-opacity duration-300
                            backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full
                            shadow-lg
                        ">
                            {index + 1}/{props?.images?.length}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListImage
