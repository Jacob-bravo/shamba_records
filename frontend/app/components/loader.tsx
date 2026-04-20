export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#f1f4fa] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#204e2b] border-r-[#204e2b] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🌾
        </div>
      </div>
      
      <p className="text-[#525a4f] mt-6 text-sm font-medium tracking-wider">
        LOADING...
      </p>
    </div>
  );
}