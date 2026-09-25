import { assets } from "../../assets/assets";
const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img className="w-12 m-auto mb-5" src={assets.exchange_icon} alt="" />
        <p className="font-semibold"> Đổi trả dễ dàng</p>
        <p className="text-gray-400">Hỗ trợ đổi trả sản phẩm nhanh chóng</p>
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.quality_icon} alt="" />
        <p className="font-semibold"> Chính sách 7 ngày</p>
        <p className="text-gray-400">An tâm mua sắm với chính sách đổi trả</p>
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.support_img} alt="" />
        <p className="font-semibold"> Chăm sóc khách hàng</p>
        <p className="text-gray-400">Tư vấn làm đẹp tận tâm mỗi ngày</p>
      </div>
    </div>
  );
};

export default OurPolicy;
