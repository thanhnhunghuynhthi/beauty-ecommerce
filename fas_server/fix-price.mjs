import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://nguyentai2292005_db_user:pXn9SXgAN3GZLOZf@furnimart-cluster.s6q7vhd.mongodb.net/fas_commerce?appName=furnimart-cluster";

async function fixPrices() {
  console.log("Kết nối MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("Đã kết nối.");

  const Variant = mongoose.connection.collection("variants");
  const Product = mongoose.connection.collection("products");

  // Update variants
  const defaultPrice = 150000;
  const defaultStock = 100;
  
  await Variant.updateMany(
    { price: 0 },
    { $set: { price: defaultPrice, stock: defaultStock, cost: 100000 } }
  );
  console.log("Đã cập nhật giá cho variants.");

  // Update products cachedPrice
  await Product.updateMany(
    { "cachedPrice.min": 0 },
    { $set: { "cachedPrice.min": defaultPrice, "cachedPrice.max": defaultPrice } }
  );
  console.log("Đã cập nhật cachedPrice cho products.");

  console.log("Xong!");
  process.exit(0);
}

fixPrices().catch(err => {
  console.error(err);
  process.exit(1);
});
