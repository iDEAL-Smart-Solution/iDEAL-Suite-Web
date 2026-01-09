import Header from "../../components/layout/Header";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Building2, Users, CreditCard, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Empowering Schools with Smart Management</h1>
        <p>
          Comprehensive school management, subscription tracking,
          and product monitoring in one platform
        </p>

        <div className="hero-actions">
          <Link to="/register-school">
            <Button>Register Your School</Button>
          </Link>

          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <Card
          icon={<Building2 size={28} />}
          title="School Management"
          description="Manage your entire school system from one place"
        />

        <Card
          icon={<Users size={28} />}
          title="User Management"
          description="Effortlessly manage students, staff, and admins"
        />

        <Card
          icon={<CreditCard size={28} />}
          title="Subscription Tracking"
          description="Track subscriptions, slots, and expiry dates"
        />

        <Card
          icon={<BarChart3 size={28} />}
          title="Analytics Dashboard"
          description="Real-time insights and performance metrics"
        />
      </section>
    </>
  );
};

export default Landing;
