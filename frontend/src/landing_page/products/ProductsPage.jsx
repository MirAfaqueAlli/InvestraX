import React from "react";
import HeroSection from "./HeroSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";
function ProductsPage() {
  return (
    <>
      <HeroSection />
      <LeftSection
        imageURL="media/images/kite.png"
        productName="Kite"
        productDescription="Our ultra-fast flagship trading platofrm with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />
      <RightSection imageURL="media/images/console.png" productName="Console" productDescription="Our ultra-fast flagship trading platofrm with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices." learnMore=""/>
      <LeftSection
        imageURL="media/images/coin.png"
        productName="Coin"
        productDescription="Our ultra-fast flagship trading platofrm with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />
      <RightSection imageURL="media/images/kiteconnect.png" productName="Kite Connect API" productDescription="Our ultra-fast flagship trading platofrm with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices." learnMore=""/>
      <LeftSection
        imageURL="media/images/varsity.png"
        productName="Varsity mobile"
        productDescription="Our ultra-fast flagship trading platofrm with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />
     <p className="text-center my-5">Want to know more about our technology stack? Check out the Zerodha.tech blog.</p>
      <Universe />
    </>
  );
}

export default ProductsPage;
