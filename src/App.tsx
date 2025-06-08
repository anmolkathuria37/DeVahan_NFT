import React, { useState, useEffect } from 'react';
import { Wallet2, Car, History, Plus, Train as Transfer, X, User, Building2, ArrowRight } from 'lucide-react';
import MintNFTForm from './components/MintNFTForm';
import TransferForm from './components/TransferForm';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';
import MetaMaskConnect from './components/MetaMaskConnect';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [transferredTokens, setTransferredTokens] = useState<string[]>([]);
  const [isDealer, setIsDealer] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metaMaskAddress, setMetaMaskAddress] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    wallet: string;
    type: 'user' | 'dealer';
  } | null>(null);

  const { t } = useLanguage();
 
  const vehicles = [
    // {
    //   name: "BMW M2",
    //   plate: "DL 5C 9012",
    //   wallet: "0x9gh62er97sd013",
    //   image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/150125/m2-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80",
    //   tokenId: "TOKEN_001"
    // },
    // {
    //   name: "Toyota Prado 250",
    //   plate: "MH 02 CD 5678",
    //   wallet: "0x8765FG556f4321",
    //   image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Land-Cruiser-250/11001/1737017932790/front-left-side-47.jpg",
    //   tokenId: "TOKEN_002"
    // },
    {
      name: "Land Rover Defender 110X",
      plate: "HR 03 EF 9012",
      wallet: "0x98762er45g0123",
      image: "data:image/jpeg;base64,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",
      tokenId: "TOKEN_003"
    },
    {
      name: "McLaren P1",
      plate: "DL 01 AB 1234",
      wallet: "0x1234456e6fg5t5",
      image: "https://i.pinimg.com/736x/f2/f7/26/f2f7264890e2d2bb4d8e7cc648ef1123.jpg",
      tokenId: "TOKEN_006"
    },
    // {
    //   name: "Mercedes-Benz Maybach S-class",
    //   plate: "UP 16 EF 9012",
    //   wallet: "0x98ij45j4ke4ert",
    //   image: "https://files.hodoor.world/main/b00ebddd-3346-43bb-8fd9-936b80bd76de.jpg",
    //   tokenId: "TOKEN_005"
    // }
  ];

  const handleMetaMaskConnect = (address: string) => {
    if (address) {
      setMetaMaskAddress(address);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const wallet = metaMaskAddress || (e.target as any).wallet.value;

    if (isDealer && (wallet === "678" || metaMaskAddress)) {
      setCurrentUser({
        name: "Siddhant",
        email: email || "sid@dealer.com",
        wallet: metaMaskAddress || "678",
        type: "dealer"
      });
      setIsAuthenticated(true);
    } else if (!isDealer && (wallet === "123" || wallet === "456" || metaMaskAddress)) {
      setCurrentUser({
        name: metaMaskAddress ? "MetaMask User" : (wallet === "123" ? "Anmol" : "Aditya"),
        email: email || "user@example.com",
        wallet: metaMaskAddress || wallet,
        type: "user"
      });
      setIsAuthenticated(true);
    }
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('home');
    setTransferredTokens([]);
    setMetaMaskAddress('');
  };

  const handleTransferComplete = (tokenId: string) => {
    setTransferredTokens(prev => [...prev, tokenId]);
  };

  const availableVehicles = vehicles.filter(vehicle => !transferredTokens.includes(vehicle.tokenId));

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header/Navbar */}
      <nav className="bg-primary-light border-b border-metallic/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Car className="w-8 h-8 text-gold" />
              <span className="ml-2 text-xl font-bold">DeVahan</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {isAuthenticated && currentUser?.type === 'user' && (
                  <div onClick={() => setCurrentPage('vehicles')} className="cursor-pointer">
                    <NavLink icon={<Car />} text={t('nav.myVehicles')} />
                  </div>
                )}
                {isAuthenticated && currentUser?.type === 'dealer' && (
                  <div onClick={() => setShowMintModal(true)} className="cursor-pointer">
                    <NavLink icon={<Plus />} text={t('nav.mintNFT')} />
                  </div>
                )}
                {isAuthenticated && currentUser?.type === 'user' && (
                  <div onClick={() => setShowTransferModal(true)} className="cursor-pointer">
                    <NavLink icon={<Transfer />} text={t('nav.transfer')} />
                  </div>
                )}
                <NavLink icon={<History />} text={t('nav.history')} />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-metallic">
                      {currentUser?.name} ({currentUser?.type})
                    </span>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-warning to-warning-orange text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-gold-light text-primary font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Wallet2 className="w-4 h-4 mr-2" />
                    {t('nav.signIn')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-light rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-metallic hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={() => setIsDealer(false)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${!isDealer ? 'bg-gold text-primary' : 'text-metallic hover:text-white'}`}
              >
                <User className="w-4 h-4 mr-2" />
                {t('auth.user')}
              </button>
              <button 
                onClick={() => setIsDealer(true)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isDealer ? 'bg-gold text-primary' : 'text-metallic hover:text-white'}`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {t('auth.dealer')}
              </button>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={() => setIsSignIn(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${isSignIn ? 'bg-neon-blue text-primary' : 'text-metallic hover:text-white'}`}
              >
                {t('auth.signIn')}
              </button>
              <button 
                onClick={() => setIsSignIn(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${!isSignIn ? 'bg-neon-blue text-primary' : 'text-metallic hover:text-white'}`}
              >
                {t('auth.signUp')}
              </button>
            </div>

            {/* MetaMask Connect */}
            <div className="mb-4">
              <MetaMaskConnect onConnect={handleMetaMaskConnect} />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-metallic/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-primary-light text-metallic">
                  {metaMaskAddress ? t('auth.walletConnected') : 'or continue with credentials'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              {!isSignIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-metallic mb-1">{t('auth.name')}</label>
                    <input 
                      type="text"   
                      name="name"
                      className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                      placeholder={`${t('auth.name')}...`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-metallic mb-1">{t('auth.phone')}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                      placeholder={`${t('auth.phone')}...`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-metallic mb-1">{t('auth.address')}</label>
                    <textarea 
                      name="address"
                      className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                      placeholder={`${t('auth.address')}...`}
                      rows={3}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-metallic mb-1">{t('auth.email')}</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                  placeholder={`${t('auth.email')}...`}
                />
              </div>
              {!metaMaskAddress && (
                <div>
                  <label className="block text-sm font-medium text-metallic mb-1">{t('auth.walletPin')}</label>
                  <input 
                    type="text" 
                    name="wallet"
                    className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder={`${t('auth.walletPin')}...`}
                  />
                </div>
              )}
              {!isSignIn && isDealer && (
                <div>
                  <label className="block text-sm font-medium text-metallic mb-1">{t('auth.dealerId')}</label>
                  <input 
                    type="text" 
                    name="dealerId"
                    className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder={`${t('auth.dealerId')}...`}
                  />
                </div>
              )}
              <button 
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-green text-primary font-bold hover:opacity-90 transition-opacity"
              >
                {isSignIn ? t('auth.signIn') : (isDealer ? t('auth.registerAsDealer') : t('auth.signUp'))}
              </button>
              {isSignIn && !metaMaskAddress && (
                <p className="text-sm text-metallic text-center mt-2">
                  {isDealer ? t('auth.demoDealer') : t('auth.demoUser')}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Mint NFT Modal */}
      <MintNFTForm 
        isOpen={showMintModal} 
        onClose={() => setShowMintModal(false)} 
      />

      {/* Transfer Modal */}
      <TransferForm
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransferComplete={handleTransferComplete}
        selectedVehicle={selectedVehicle}
      />

      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block">{t('home.title1')}</span>
                  <span className="block text-gold">{t('home.title2')}</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-metallic sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  {t('home.subtitle')}
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-green text-primary font-bold hover:opacity-90 transition-opacity" 
                    style={{ background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}
                  >
                    {t('home.getStarted')}
                  </button>
                  <button className="px-8 py-3 rounded-lg border-2 border-metallic/50 hover:border-metallic transition-colors">
                    {t('home.learnMore')}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Background Effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary-light to-primary" />
            <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title={t('feature.secureOwnership.title')}
                description={t('feature.secureOwnership.desc')}
                icon={<Wallet2 className="w-8 h-8 text-gold" />}
              />
              <FeatureCard
                title={t('feature.instantTransfers.title')}
                description={t('feature.instantTransfers.desc')}
                icon={<Transfer className="w-8 h-8 text-gold" />}
              />
              <FeatureCard
                title={t('feature.completeHistory.title')}
                description={t('feature.completeHistory.desc')}
                icon={<History className="w-8 h-8 text-gold" />}
              />
            </div>
          </div>
        </>
      ) : (
        // Vehicles Page
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8">{t('vehicles.title')}</h2>
          {availableVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-metallic text-lg">{t('vehicles.noVehicles')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVehicles.map((vehicle, index) => (
                <div key={index} className="bg-primary-light rounded-lg overflow-hidden border border-metallic/20 hover:border-metallic/40 transition-all transform hover:scale-[1.02]">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Car className="w-6 h-6 text-gold mr-3" />
                      <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                    </div>
                    <div className="space-y-2 text-metallic">
                      <p>{t('vehicles.plateNumber')} <span className="text-white">{vehicle.plate}</span></p>
                      <p>{t('vehicles.wallet')} <span className="text-white">{vehicle.wallet}</span></p>
                      <p>{t('vehicles.tokenId')} <span className="text-white">{vehicle.tokenId}</span></p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle.tokenId);
                        setShowTransferModal(true);
                      }}
                      className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-green text-primary font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      <span>{t('vehicles.transfer')}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chatbot Component */}
      <Chatbot />
      
      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  );
}

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <a href="#" className="flex items-center px-3 py-2 rounded-md text-metallic hover:text-white hover:bg-primary-light transition-colors">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 mr-2' })}
      {text}
    </a>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-lg bg-primary-light border border-metallic/20 hover:border-metallic/40 transition-colors">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-metallic">{description}</p>
    </div>
  );
}

export default App;