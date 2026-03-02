import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomCursor from './components/CustomCursor';
import SplashIntro from './components/SplashIntro';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShoppingCart, LogIn, User, LogOut } from 'lucide-react';
import CartPage from './pages/CartPage';
import CheckoutSuccess from './pages/CheckoutSuccess';

const Account = () => <div className="pt-40 text-center font-serif italic text-3xl h-screen">My Account Dashboard...</div>;
const Orders = () => <div className="pt-40 text-center font-serif italic text-3xl h-screen">Orders History...</div>;

function Navigation() {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between glass border-b border-zinc-200/50 transition-all duration-500 hover:bg-white/90">
            <div className="flex items-center gap-12">
                <a href="/" className="text-xl font-bold tracking-[0.4em] text-primary transition-all hover:tracking-[0.6em]">ESSENCE ELEGANCE</a>
                <nav className="hidden lg:flex items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase">
                    <a href="/" className="hover:text-gold transition-colors relative group py-2">
                        Home
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                    </a>
                    <a href="/shop" className="hover:text-gold transition-colors relative group py-2">
                        Shop
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                    </a>
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase font-semibold">
                    {user ? (
                        <>
                            {user.role === 'admin' || user.email === 'admin@gmail.com' ? (
                                <a href="/admin.html" className="flex items-center gap-2 text-gold hover:text-black transition-all group" title="Go to Admin Dashboard">
                                    <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    <span className="max-w-[100px] truncate underline underline-offset-4 decoration-gold/50">Admin Board</span>
                                </a>
                            ) : (
                                <div className="flex items-center gap-2 text-gold">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="max-w-[100px] truncate">{user.username}</span>
                                </div>
                            )}
                            <span className="w-px h-3 bg-zinc-200" />
                            <button onClick={logout} className="flex items-center gap-2 hover:text-gold transition-all group">
                                <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <a href="/login" className="flex items-center gap-2 hover:text-gold transition-all group">
                            <LogIn className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Login</span>
                        </a>
                    )}
                </div>

                <a href="/cart" className="relative p-2 group bg-zinc-900 rounded-full hover:bg-gold transition-all duration-500">
                    <ShoppingCart className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                            {cart.length}
                        </span>
                    )}
                </a>
            </div>
        </header>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans cursor-none selection:bg-gold/30 selection:text-primary">
                        <SplashIntro />
                        <CustomCursor />

                        <Navigation />

                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/account" element={<Account />} />
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout-success" element={<CheckoutSuccess />} />
                            </Routes>
                        </main>

                        <footer className="py-24 px-8 bg-[#0a0a0a] text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                                <div className="col-span-1 md:col-span-2">
                                    <h2 className="text-3xl font-serif italic mb-8 tracking-tighter">Essence Elegance</h2>
                                    <p className="max-w-sm text-zinc-500 text-sm font-light leading-8 tracking-wide italic">
                                        Creating invisible garments that define your presence. Every bottle is a distilled emotion, crafted with rare materials from the furthest corners of the globe.
                                    </p>
                                    <div className="mt-12 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-gold hover:text-gold cursor-pointer transition-all"><i className="fab fa-instagram text-sm"></i></div>
                                        <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-gold hover:text-gold cursor-pointer transition-all"><i className="fab fa-facebook-f text-sm"></i></div>
                                        <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-gold hover:text-gold cursor-pointer transition-all"><i className="fab fa-pinterest-p text-sm"></i></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-8 text-gold">Explore</h4>
                                    <ul className="flex flex-col gap-4 text-xs tracking-widest text-zinc-400 font-light italic">
                                        <li><a href="/shop" className="hover:text-white transition-colors">Our Collection</a></li>
                                        <li><a href="/discovery" className="hover:text-white transition-colors">Scent Discovery</a></li>
                                        <li><a href="/about" className="hover:text-white transition-colors">Our Philosophy</a></li>
                                        <li><a href="/contact" className="hover:text-white transition-colors">Private Consultation</a></li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-8 text-gold">Maison</h4>
                                    <ul className="flex flex-col gap-4 text-xs tracking-widest text-zinc-400 font-light italic">
                                        <li><a href="/shipping" className="hover:text-white transition-colors">Global Delivery</a></li>
                                        <li><a href="/returns" className="hover:text-white transition-colors">The Promise</a></li>
                                        <li><a href="/faq" className="hover:text-white transition-colors">Concierge FAQ</a></li>
                                        <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Sanctum</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-24 pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                                <p className="text-[9px] tracking-[0.3em] font-medium text-zinc-500 uppercase">© 2026 ESSENCE ELEGANCE. ALL RIGHTS RESERVED.</p>
                                <div className="flex items-center gap-4">
                                    <p className="text-[9px] tracking-[0.3em] font-medium text-zinc-600 uppercase">Design By Niraj5505</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
