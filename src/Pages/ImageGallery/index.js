import React, { useEffect, useState } from "react";
import axios from "axios";
import constants from "../../constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import InfiniteScroll from "react-infinite-scroll-component";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    return () => {
      setImages([]);
      setPage(1);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(constants.UNSPLASH_API_URL, {
          params: { page },
        });

        if (res.status) {
          setImages((prevState) => [...prevState, ...res.data]);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [page]);

  const next = () => {
    setPage(page + 1);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full py-4 px-2 flex items-start flex-col overflow-hidden">
        <div className=" flex items-center mb-4 px-2">
          <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer">
            Image Gallery
          </h1>
          <p className="text-sm text-gray-500 font-bold ml-1 self-end hidden lg:block capitalize">
            with Lazy loading and infinite scrolling
          </p>
        </div>
        <div
          className="w-full h-full overflow-auto scrollRightPanel px-2"
          id="scroll"
        >
          <InfiniteScroll
            dataLength={images.length}
            next={next}
            hasMore={true}
            scrollableTarget="scroll"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-4  gap-2 gallery">
              {images.map((image) => {
                return (
                  <LazyLoadImage
                    alt={image.alt_description}
                    effect="blur"
                    src={image.urls.regular}
                    key={image.id}
                    height="100%"
                  />
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
