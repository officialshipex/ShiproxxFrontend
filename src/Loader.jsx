import icon from "./assets/Group.png"
const SpinnerWithCompanyIcon = () => {
    return (
        <div className="flex justify-center items-center h-20">
            <div className="relative w-10 h-10">
                {/* Spinner Circle */}
                <div className="absolute inset-0 rounded-full border-4 border-t-gray-300 border-r-gray-300 border-b-[#10BE3B] border-l-[#10BE3B] animate-spin"></div>

                {/* Company Logo in Center */}
                <img
                    src={icon} // ⬅️ Replace with your logo path
                    alt="Company Logo"
                    className="absolute inset-0 m-auto w-5 h-5 object-contain"
                />
            </div>
        </div>
    );
};
export default SpinnerWithCompanyIcon;