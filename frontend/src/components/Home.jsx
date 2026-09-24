import React from "react";
import Form from "./Form";

const Home = () => {
  return (
    <main className="h-screen w-full overflow-hidden bg-slate-950">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[55%_45%]">
        {/* LEFT SIDE */}
        <section
          className="
            hidden lg:flex
            h-full
            items-center
            justify-center
            bg-[#f5c400]
            overflow-hidden
          "
        >
          <img
            src="/fraudDetecting.png"
            alt="Fraud Detection"
            className="
              h-full
              w-full
              object-contain
              p-8
              xl:p-12
            "
          />
        </section>

        {/* RIGHT SIDE */}
        <section
          className="
            h-full
            flex
            items-center
            justify-center
            bg-slate-950
            px-5
            sm:px-8
            lg:px-10
            xl:px-16
          "
        >
          <Form />
        </section>
      </div>
    </main>
  );
};

export default Home;
