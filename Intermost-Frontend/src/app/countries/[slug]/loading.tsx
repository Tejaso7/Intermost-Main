import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CountryLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        
        {/* Shimmer Hero Area */}
        <section className="relative h-[60vh] min-h-[450px] bg-gray-900 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 shimmer opacity-20" />
          <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center space-y-6">
            
            {/* Country Flag & Title Shimmer */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-12 rounded-lg shimmer opacity-30" />
              <div className="w-40 h-6 rounded-md shimmer opacity-30" />
            </div>

            {/* Main Header Shimmer */}
            <div className="w-3/4 h-12 md:h-16 rounded-xl shimmer opacity-40 mx-auto" />
            <div className="w-1/2 h-6 rounded-md shimmer opacity-30 mx-auto" />

            {/* Quick Stats Pill Shimmers */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="w-28 h-10 rounded-full shimmer opacity-30" />
              <div className="w-36 h-10 rounded-full shimmer opacity-30" />
              <div className="w-32 h-10 rounded-full shimmer opacity-30" />
            </div>
          </div>
        </section>

        {/* Shimmer Overview Area */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Left Column Overview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="w-1/3 h-8 rounded-lg shimmer" />
                <div className="space-y-3">
                  <div className="w-full h-4 rounded shimmer" />
                  <div className="w-full h-4 rounded shimmer" />
                  <div className="w-11/12 h-4 rounded shimmer" />
                  <div className="w-4/5 h-4 rounded shimmer" />
                </div>
                
                {/* Highlights grid shimmer */}
                <div className="grid sm:grid-cols-2 gap-4 pt-6">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg shimmer shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="w-1/2 h-4 rounded shimmer" />
                        <div className="w-5/6 h-3 rounded shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Course Details Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm space-y-6 h-fit">
                <div className="w-1/2 h-6 rounded shimmer" />
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <div className="w-1/3 h-4 rounded shimmer" />
                      <div className="w-1/4 h-4 rounded shimmer" />
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <div className="w-1/3 h-5 rounded shimmer" />
                    <div className="w-1/3 h-6 rounded shimmer" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Shimmer Colleges Grid */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container-custom">
            <div className="text-center space-y-3 mb-12">
              <div className="w-1/3 h-8 rounded-lg shimmer mx-auto" />
              <div className="w-1/4 h-4 rounded shimmer mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
                  <div className="h-48 w-full shimmer shrink-0" />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="w-3/4 h-5 rounded shimmer" />
                      <div className="w-1/2 h-3 rounded shimmer" />
                      <div className="flex gap-2 pt-2">
                        <div className="w-12 h-5 rounded shimmer" />
                        <div className="w-14 h-5 rounded shimmer" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="space-y-1 flex-1">
                        <div className="w-1/3 h-3 rounded shimmer" />
                        <div className="w-1/2 h-5 rounded shimmer" />
                      </div>
                      <div className="w-20 h-8 rounded-lg shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
