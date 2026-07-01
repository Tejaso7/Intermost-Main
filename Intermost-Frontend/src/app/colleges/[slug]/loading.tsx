import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CollegeLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        
        {/* Shimmer Banner Hero */}
        <section className="relative h-[45vh] min-h-[350px] bg-gray-900 overflow-hidden flex items-end pb-8">
          <div className="absolute inset-0 shimmer opacity-20" />
          <div className="relative z-10 container-custom w-full">
            <div className="max-w-4xl space-y-4">
              
              {/* Back button link shimmer */}
              <div className="w-48 h-4 rounded shimmer opacity-30" />
              
              {/* Profile card row shimmer */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                
                {/* Logo box */}
                <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 shadow-xl shimmer opacity-40 shrink-0" />
                
                {/* Name & metadata */}
                <div className="space-y-3 flex-1">
                  <div className="w-3/4 h-8 md:h-10 rounded-xl shimmer opacity-40" />
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-24 h-4 rounded shimmer opacity-30" />
                    <div className="w-20 h-4 rounded shimmer opacity-30" />
                    <div className="w-32 h-6 rounded-full shimmer opacity-30" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Shimmer Content Details */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column blocks */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* About block */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                  <div className="w-1/3 h-6 rounded shimmer" />
                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <div className="w-full h-4 rounded shimmer" />
                    <div className="w-full h-4 rounded shimmer" />
                    <div className="w-5/6 h-4 rounded shimmer" />
                    <div className="w-2/3 h-4 rounded shimmer" />
                  </div>
                </div>

                {/* Recognition badges block */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                  <div className="w-1/2 h-6 rounded shimmer" />
                  <div className="w-3/4 h-4 rounded shimmer" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-12 rounded-xl shimmer" />
                    ))}
                  </div>
                </div>

                {/* Facilities block */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-4">
                  <div className="w-1/2 h-6 rounded shimmer" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg shimmer shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="w-1/3 h-4 rounded shimmer" />
                          <div className="w-2/3 h-3 rounded shimmer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column billing block */}
              <div className="space-y-6">
                
                {/* Fee card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-6">
                  <div className="flex justify-between items-center pb-2">
                    <div className="w-1/3 h-5 rounded shimmer" />
                    <div className="w-20 h-5 rounded shimmer" />
                  </div>
                  
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex justify-between items-center pb-2">
                        <div className="w-1/3 h-4 rounded shimmer" />
                        <div className="w-1/4 h-4 rounded shimmer" />
                      </div>
                    ))}
                    <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100/50 text-center space-y-2">
                      <div className="w-1/3 h-3 rounded shimmer mx-auto" />
                      <div className="w-1/2 h-8 rounded shimmer mx-auto" />
                    </div>
                  </div>
                  
                  {/* Button */}
                  <div className="w-full h-12 rounded-xl shimmer" />
                </div>

                {/* Direct info list */}
                <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
                  <div className="w-1/2 h-5 rounded shimmer opacity-30" />
                  <div className="space-y-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full shimmer opacity-20 shrink-0 mt-0.5" />
                        <div className="w-5/6 h-3 rounded shimmer opacity-20" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
