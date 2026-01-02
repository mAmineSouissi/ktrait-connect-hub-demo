import React from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  image: string;
}

const Blog: React.FC = () => {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Espaces inspirés : allier fonctionnalité et esthétique',
      excerpt:
        "La décoration intérieure moderne vise à créer un espace élégant, fonctionnel et esthétique, reflet de la vie contemporaine. Que vous rénoviez ...",
      author: 'Administrateur',
      image: '/assets/m1.png',
    },
    {
      id: '2',
      title: "Idées d'intérieur innovantes pour rafraîchir votre espace de vie",
      excerpt:
        "La décoration intérieure moderne vise à créer un espace élégant, fonctionnel et esthétique, reflet de la vie contemporaine. Que vous rénoviez ...",
      author: 'Administrateur',
      image: '/assets/m2.png',
    },
    {
      id: '3',
      title: "Transformez votre maison avec des conseils de décoration ...",
      excerpt:
        "La décoration intérieure moderne vise à créer un espace élégant, fonctionnel et esthétique, reflet de la vie contemporaine. Que vous rénoviez ...",
      author: 'Administrateur',
      image: '/assets/m3.png',
    },
  ];

  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="px-4 md:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Badge */}
          <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full mb-6">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>
            <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
              directement de la salle de rédaction
            </span>
          </div>

          {/* Section Heading */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold text-black leading-tight relative lg:ml-[500px] lg:-mt-14">
              Jetez un œil à{' '}
              <span className="text-teal-700 block lg:inline">
                notre dernier<br className="lg:hidden" /> blog
              </span>{' '}
              et articles.
            </h2>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${post.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
          {/* Blog Image */}
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Blog Content */}
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <p className="text-sm text-gray-600 mb-2">
              par <span className="text-teal-700 font-medium">{post.author}</span>
            </p>
            <h3 className="text-lg md:text-xl lg:text-2xl font-cal-sans font-semibold text-black mb-3 leading-snug group-hover:text-teal-700 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base flex-1">{post.excerpt}</p>

            <div className="mt-4 flex items-center text-teal-700 font-medium group-hover:translate-x-1 transition-transform">
              <span className="text-sm md:text-base">Lire plus</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Blog;
