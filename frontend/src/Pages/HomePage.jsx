import React, { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import ProductList from "../components/ProductList";
import { useImageStore } from "../stores/useImageStore.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
export default function HomePage() {
  const {loading, getImages, images } = useImageStore();
useEffect(() => {
  getImages();
}, [getImages]);
if (loading) {
  return <LoadingSpinner />
}
  return (
    <section className="container mx-auto p-4 flex flex-col items-center">
      <Nav />
      {!loading && Array.isArray(images) && images.length > 0 && <ProductList images={images} />}
    </section>
  );
}
