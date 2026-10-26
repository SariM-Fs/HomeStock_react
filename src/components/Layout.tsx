import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { userContext } from "../context/UserContext";

const Layout = () => {
    const { user, logout } = useContext(userContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div>
            <nav
                data-open={menuOpen}
                onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
                }}
            >
                <button
                    className="menu-toggle"
                    aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                />
                <p className="user-name">{user?.displayName}</p>
                <p className="user-role">{user?.role === "Admin" ? "מנהל" : "בן בית"}</p>
                <Link to="/">דף הבית</Link>
                <Link to="inventory">מלאי</Link>
                <Link to="/shop-List">רשימת קניות</Link>
                {user?.role === "Admin" && (
                    <Link to="/permissions">משתמשים והרשאות</Link>
                )}
                <Link to="register">יצירת משפחה חדשה</Link>
                {user && <button className="logout" onClick={logout}>התנתקות</button>}
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
export default Layout