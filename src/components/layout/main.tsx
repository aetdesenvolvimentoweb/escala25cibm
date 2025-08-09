import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface IMainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: IMainLayoutProps) => {
  const pageTitle = `Resumo Diário > ${title}`;

  return (
    <div id="mainContainer" className="bg-gray-200">
      <div className="flex flex-col w-full max-w-xl min-h-screen mx-auto">
        <Head>
          <title>Resumo Diário - 25ª CIBM</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Aplicação para gerar e acompanhar o resumo diário do serviço de dia do 25ª Companhia Independente Bombeiro Militar do Corpo de Bombeiros Militar do Estado de Goiás - CBMGO"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="flex items-center justify-between text-white bg-red-800">
          <div className="p-2 bg-white border-l border-l-red-800">
            <div className="relative w-24 h-16">
              <Link href={"/"} passHref>
                <Image
                  src={"/images/fenix.jpeg"}
                  fill
                  sizes="auto, auto"
                  alt="logomarca bombeiros"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full text-sm">
            <h1 className="text-base font-bold">Resumo Diário</h1>
            <span>25ª Companhia Independente Bombeiro Militar</span>
          </div>
        </header>
        <main className="flex-1 p-2 bg-red-600">
          <h1 className="p-2 text-sm font-bold text-gray-800 rounded-md bg-gray-50">
            {pageTitle}
          </h1>
          <div className="p-2 mt-2 text-sm text-gray-800 rounded-md bg-gray-50">
            {children}
          </div>
        </main>
        <footer className="flex items-center justify-center p-2 text-xs text-white bg-red-800">
          A & T Desenvolvimento Web
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
