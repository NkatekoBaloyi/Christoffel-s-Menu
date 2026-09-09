import React, { useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------
   Shared design tokens
------------------------------------------------------------------------- */

const COLORS = {
  primary: "#1F4B3F",
  primaryText: "#FFFFFF",
  background: "#FFFFFF",
  border: "#D9DCD9",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  placeholder: "#9A9A9A",
  errorText: "#B3261E",
  divider: "#E8E8E4",
  chipBorder: "#1F4B3F",
} as const;

const FRAME_STYLE: React.CSSProperties = {
  width: 320,
  minHeight: 640,
  backgroundColor: COLORS.background,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  overflow: "hidden",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  padding: "12px",
  fontSize: 13.5,
  color: COLORS.textPrimary,
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.textPrimary,
  marginBottom: 6,
  display: "block",
};

const fieldWrapperStyle: React.CSSProperties = { marginBottom: 18 };

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: COLORS.primary,
  color: COLORS.primaryText,
  border: "none",
  borderRadius: 8,
  padding: "14px 0",
  fontSize: 14.5,
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: 12,
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: COLORS.background,
  color: COLORS.textPrimary,
  border: `1.5px solid ${COLORS.textPrimary}`,
  borderRadius: 8,
  padding: "14px 0",
  fontSize: 14.5,
  fontWeight: 700,
  cursor: "pointer",
};

/* -------------------------------------------------------------------------
   Shared domain types + starting data
------------------------------------------------------------------------- */

type Category = "Starters" | "Mains" | "Desserts";
type Course = "Starter" | "Main" | "Dessert";
type FilterOption = "All" | Category;

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imagekeywords: string;
}

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const CATEGORY_TO_COURSE: Record<Category, Course> = {
  Starters: "Starter",
  Mains: "Main",
  Desserts: "Dessert",
};

const COURSE_TO_CATEGORY: Record<Course, Category> = {
  Starter: "Starters",
  Main: "Mains",
  Dessert: "Desserts",
};

const initialDishes: Dish[] = [
  { id: "1", name: "Garlic Bread", description: "Toasted baguette, herb butter", price: 45, category: "Starters", imagekeywords: "garlic,bread" },
  { id: "2", name: "Caprese Salad", description: "Tomato, mozzarella, basil", price: 60, category: "Starters", imagekeywords: "caprese,salad" },
  { id: "3", name: "Bruschetta", description: "Grilled ciabatta, tomato, basil oil", price: 55, category: "Starters", imagekeywords: "bruschetta" },
  { id: "4", name: "Soup of the Day", description: "Ask your waiter for today's special", price: 50, category: "Starters", imagekeywords: "soup,bowl" },
  { id: "5", name: "Grilled Chicken", description: "Chicken breast, roast veg", price: 180, category: "Mains", imagekeywords: "grilled,chicken" },
  { id: "6", name: "Beef Fillet", description: "250g fillet, chips, sauce", price: 180, category: "Mains", imagekeywords: "beef,steak" },
  { id: "7", name: "Seafood Linguine", description: "Prawns, calamari, white wine sauce", price: 145, category: "Mains", imagekeywords: "seafood,pasta" },
  { id: "8", name: "Margherita Pizza", description: "San marzano tomato, fior di latte", price: 110, category: "Mains", imagekeywords: "margherita,pizza" },
  { id: "9", name: "Vegetable Curry", description: "Seasonal veg, coconut sauce, rice", price: 95, category: "Mains", imagekeywords: "vegetable,curry" },
  { id: "10", name: "Chocolate Fondant", description: "Warm cake, vanilla ice cream", price: 70, category: "Desserts", imagekeywords: "chocolate,fondant" },
  { id: "11", name: "New York Cheesecake", description: "Baked cheesecake, berry compote", price: 65, category: "Desserts", imagekeywords: "cheesecake,berries" },
  { id: "12", name: "Crème Brûlée", description: "Vanilla custard, caramelised sugar", price: 60, category: "Desserts", imagekeywords: "creme,brulee" },
];

const filterOptions: FilterOption[] = ["All", "Starters", "Mains", "Desserts"];
const courseOptions: Course[] = ["Starter", "Main", "Dessert"];

const formatRand = (amount: number): string => `R ${amount.toFixed(2)}`;

/* -------------------------------------------------------------------------
   1. Login screen
------------------------------------------------------------------------- */

interface LoginScreenProps {
  title?: string;
  onSignIn?: (email: string, password: string) => void;
  onCreateAccount?: () => void;
  onContinue?: () => void;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  title = "Sign In",
  onSignIn,
  onCreateAccount,
  onContinue,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = (): boolean => {
    const nextErrors: LoginErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must contain at least 6 characters";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;
    onSignIn?.(email.trim(), password);
  };

  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, textAlign: "right", padding: "6px 16px 0" }}>
        9:41
      </div>

      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "20px" }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Welcome back</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{title}</div>
      </div>

      <div style={{ padding: "25px 20px", flex: 1 }}>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="e.g. chef@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            style={{ ...inputStyle, borderColor: errors.email ? COLORS.errorText : COLORS.border }}
          />
          {errors.email && <div style={{ fontSize: 11, color: COLORS.errorText, marginTop: 4 }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              style={{ ...inputStyle, paddingRight: 70, borderColor: errors.password ? COLORS.errorText : COLORS.border }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: COLORS.primary,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div style={{ fontSize: 11, color: COLORS.errorText, marginTop: 4 }}>{errors.password}</div>}
        </div>

        <div style={{ textAlign: "right", marginBottom: 22 }}>
          <button type="button" style={{ border: "none", background: "none", color: COLORS.primary, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            Forgot password?
          </button>
        </div>

        <button onClick={handleSignIn} style={primaryButtonStyle}>Sign In</button>
        <button onClick={onCreateAccount} style={secondaryButtonStyle}>Create Account</button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          <span style={{ fontSize: 11, color: COLORS.textSecondary }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        </div>

        <button
          onClick={onContinue}
          style={{
            width: "100%",
            backgroundColor: "#F7F8F7",
            color: COLORS.primary,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "12px 0",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Continue to Menu
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   2. Loading screen
------------------------------------------------------------------------- */

interface LoadingScreenProps {
  onFinished?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinished?.(), 1400);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div
      style={{
        ...FRAME_STYLE,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        color: COLORS.primaryText,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: COLORS.primaryText,
          color: COLORS.primary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 20,
        }}
      >
        C
      </div>
      <div style={{ fontSize: 25, fontWeight: 800, marginBottom: 8 }}>Christoffel's Menu</div>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 35 }}>Personalised culinary experiences</div>
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid rgba(255,255,255,0.35)",
          borderTop: "3px solid white",
          borderRadius: "50%",
          animation: "chef-spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes chef-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* -------------------------------------------------------------------------
   3. Menu manager (home) screen
------------------------------------------------------------------------- */

interface MenuStats {
  total: number;
  starters: number;
  mains: number;
  desserts: number;
}

interface MenuManagerScreenProps {
  restaurantName?: string;
  stats: MenuStats;
  onViewMenu?: () => void;
  onAddDish?: () => void;
}

const MenuManagerScreen: React.FC<MenuManagerScreenProps> = ({
  restaurantName = "Christoffel's Menu",
  stats,
  onViewMenu,
  onAddDish,
}) => {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, textAlign: "right", padding: "6px 16px 0" }}>
        9:41 AM
      </div>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "12px 20px 20px", fontSize: 20, fontWeight: 700 }}>
        {restaurantName}
      </div>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.textPrimary }}>Restaurant Menu Manager</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textSecondary }}>Manage your menu dishes with ease.</p>
        </div>

        <button onClick={onViewMenu} style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, border: "none", borderRadius: 8, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          View Menu
        </button>

        <button onClick={onAddDish} style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary, border: `1px solid ${COLORS.textPrimary}`, borderRadius: 8, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Add New Dish
        </button>

        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "16px 16px", minHeight: 140 }}>
          <div style={{ fontSize: 14, color: COLORS.textPrimary, marginBottom: 6 }}>Total Dishes: {stats.total}</div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
            Desserts: {stats.desserts}&nbsp;&nbsp;Mains: {stats.mains}&nbsp;&nbsp;|&nbsp;&nbsp;Starters: {stats.starters}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   4. Menu list screen
------------------------------------------------------------------------- */

interface DishThumbnailProps {
  keywords: string;
  alt: string;
}

const DishThumbnail: React.FC<DishThumbnailProps> = ({ keywords, alt }) => {
  const [failed, setFailed] = useState(false);
  const src = `https://loremflickr.com/160/160/${encodeURIComponent(keywords)}`;

  if (failed) {
    return (
      <div style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#EDEDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
        🍽️
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0, backgroundColor: "#EDEDE8" }}
    />
  );
};

interface DishRowProps {
  dish: Dish;
  onClick?: () => void;
}

const DishRow: React.FC<DishRowProps> = ({ dish, onClick }) => (
  <div
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, marginBottom: 10, cursor: "pointer" }}
  >
    <DishThumbnail keywords={dish.imagekeywords} alt={dish.name} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{dish.name}</div>
      <div style={{ fontSize: 12.5, color: COLORS.textSecondary, marginTop: 2 }}>{dish.description}</div>
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary, whiteSpace: "nowrap" }}>{formatRand(dish.price)}</div>
  </div>
);

interface MenuListScreenProps {
  title?: string;
  items: Dish[];
  onAddDish?: () => void;
  onSelectDish?: (id: string) => void;
}

const MenuListScreen: React.FC<MenuListScreenProps> = ({
  title = "Menu Items",
  items,
  onAddDish,
  onSelectDish,
}) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

  const filteredItems = useMemo(() => {
    return items.filter((dish) => {
      const matchesFilter = activeFilter === "All" || dish.category === activeFilter;
      const matchesSearch = dish.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [items, search, activeFilter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<Category, Dish[]> = { Starters: [], Mains: [], Desserts: [] };
    filteredItems.forEach((dish) => groups[dish.category].push(dish));
    return groups;
  }, [filteredItems]);

  const categoriesToRender = (Object.keys(groupedByCategory) as Category[]).filter(
    (category) => groupedByCategory[category].length > 0
  );

  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, textAlign: "right", padding: "6px 16px 0" }}>
        9:41
      </div>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "12px 20px 20px", fontSize: 20, fontWeight: 700 }}>
        {title}
      </div>

      <div style={{ padding: "16px 20px 90px", flex: 1, overflowY: "auto" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes..."
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 14, outline: "none", color: COLORS.textPrimary }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {filterOptions.map((option) => {
            const isActive = activeFilter === option;
            return (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                style={{
                  border: `1px solid ${COLORS.chipBorder}`,
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  backgroundColor: isActive ? COLORS.primary : COLORS.background,
                  color: isActive ? COLORS.primaryText : COLORS.primary,
                  cursor: "pointer",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {categoriesToRender.length === 0 && (
          <div style={{ color: COLORS.textSecondary, fontSize: 13 }}>No dishes match your search.</div>
        )}

        {categoriesToRender.map((category) => (
          <div key={category} style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{category}</h3>
            {groupedByCategory[category].map((dish) => (
              <DishRow key={dish.id} dish={dish} onClick={() => onSelectDish?.(dish.id)} />
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={onAddDish}
        aria-label="Add new dish"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: COLORS.primary,
          color: COLORS.primaryText,
          border: "none",
          fontSize: 24,
          fontWeight: 400,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------
   5. Dish details screen
------------------------------------------------------------------------- */

interface DishDetailsScreenProps {
  title?: string;
  dish: Dish;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  onViewReceipt?: () => void;
}

const DishDetailsScreen: React.FC<DishDetailsScreenProps> = ({
  title = "Dish Details",
  dish,
  onEdit,
  onDelete,
  onBack,
  onViewReceipt,
}) => {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, padding: "6px 16px 0", display: "flex", justifyContent: "space-between" }}>
        <span onClick={onBack} style={{ cursor: "pointer", opacity: 0.85 }}>← Back</span>
        <span>9:41</span>
      </div>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "12px 20px 20px", fontSize: 20, fontWeight: 700 }}>
        {title}
      </div>

      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "16px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 6 }}>{dish.name}</div>
          <div style={{ fontSize: 12.5, color: COLORS.textSecondary }}>Course: {CATEGORY_TO_COURSE[dish.category]}</div>
          <div style={{ fontSize: 12.5, color: COLORS.textSecondary, marginBottom: 10 }}>Price: {formatRand(dish.price)}</div>
          <div style={{ fontSize: 13, color: COLORS.textPrimary, lineHeight: 1.4 }}>{dish.description}</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onEdit} style={{ flex: 1, backgroundColor: COLORS.primary, color: COLORS.primaryText, border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={onDelete} style={{ flex: 1, backgroundColor: COLORS.background, color: COLORS.textPrimary, border: `1.5px solid ${COLORS.textPrimary}`, borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Delete
          </button>
        </div>

        <button
          onClick={onViewReceipt}
          style={{
            width: "100%",
            marginTop: 12,
            backgroundColor: "#F7F8F7",
            color: COLORS.primary,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "12px 0",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View Receipt
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   6. Add / edit menu item screen
------------------------------------------------------------------------- */

interface MenuItemFormValues {
  name: string;
  description: string;
  course: Course | "";
  price: string;
}

interface AddMenuItemFormErrors {
  name?: string;
  course?: string;
  price?: string;
}

interface AddMenuItemSaveValue {
  name: string;
  description: string;
  course: Course;
  price: number;
}

interface AddMenuItemScreenProps {
  title?: string;
  initialValues?: Partial<MenuItemFormValues>;
  onSave?: (value: AddMenuItemSaveValue) => void;
  onCancel?: () => void;
}

const AddMenuItemScreen: React.FC<AddMenuItemScreenProps> = ({
  title = "Add Menu Item",
  initialValues,
  onSave,
  onCancel,
}) => {
  const [values, setValues] = useState<MenuItemFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    course: initialValues?.course ?? "",
    price: initialValues?.price ?? "",
  });
  const [errors, setErrors] = useState<AddMenuItemFormErrors>({});

  const updateField = <K extends keyof MenuItemFormValues>(
    field: K,
    value: MenuItemFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: AddMenuItemFormErrors = {};
    const parsedPrice = parseFloat(values.price);

    if (!values.name.trim()) nextErrors.name = "Dish name is required";
    if (!values.course) nextErrors.course = "Please select a course";
    if (!values.price.trim() || isNaN(parsedPrice) || parsedPrice < 0) {
      nextErrors.price = "Enter a valid price";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({
      name: values.name.trim(),
      description: values.description.trim(),
      course: values.course as Course,
      price: parseFloat(values.price),
    });
  };

  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, textAlign: "right", padding: "6px 16px 0" }}>
        Christoffel's Menu
      </div>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "12px 20px 20px", fontSize: 20, fontWeight: 700 }}>
        {title}
      </div>

      <div style={{ padding: "20px 20px 24px" }}>
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Dish Name</label>
          <input
            type="text"
            placeholder="e.g. Grilled Chicken"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{ ...inputStyle, borderColor: errors.name ? COLORS.errorText : COLORS.border }}
          />
          {errors.name && <div style={{ fontSize: 11, color: COLORS.errorText, marginTop: 4 }}>{errors.name}</div>}
        </div>

        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Short description of the dish"
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Course</label>
          <select
            value={values.course}
            onChange={(e) => updateField("course", e.target.value as Course)}
            style={{
              ...inputStyle,
              borderColor: errors.course ? COLORS.errorText : COLORS.border,
              color: values.course ? COLORS.textPrimary : COLORS.placeholder,
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%231A1A1A'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              paddingRight: 28,
            }}
          >
            <option value="" disabled>Select course (Starter / Main / Dessert)</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.course && <div style={{ fontSize: 11, color: COLORS.errorText, marginTop: 4 }}>{errors.course}</div>}
        </div>

        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Price (R)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 120.00"
            value={values.price}
            onChange={(e) => updateField("price", e.target.value)}
            style={{ ...inputStyle, borderColor: errors.price ? COLORS.errorText : COLORS.border }}
          />
          {errors.price && <div style={{ fontSize: 11, color: COLORS.errorText, marginTop: 4 }}>{errors.price}</div>}
        </div>

        <button onClick={handleSave} style={primaryButtonStyle}>Save Menu Item</button>
        <button onClick={onCancel} style={secondaryButtonStyle}>Cancel</button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   7. Receipt screen
------------------------------------------------------------------------- */

interface ReceiptScreenProps {
  title?: string;
  items: ReceiptItem[];
  taxRatePercent?: number;
  onDone?: () => void;
  onNewOrder?: () => void;
}

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  title = "Receipt",
  items,
  taxRatePercent = 15,
  onDone,
  onNewOrder,
}) => {
  const calculatedItems = useMemo(
    () => items.map((item) => ({ ...item, itemTotal: item.price * item.quantity })),
    [items]
  );
  const subtotal = useMemo(() => calculatedItems.reduce((sum, item) => sum + item.itemTotal, 0), [calculatedItems]);
  const tax = useMemo(() => subtotal * (taxRatePercent / 100), [subtotal, taxRatePercent]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <div style={FRAME_STYLE}>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, fontSize: 12, textAlign: "right", padding: "6px 16px 0" }}>
        9:41
      </div>
      <div style={{ backgroundColor: COLORS.primary, color: COLORS.primaryText, padding: "12px 20px 20px", fontSize: 20, fontWeight: 700 }}>
        {title}
      </div>

      <div style={{ padding: "20px 20px 24px", flex: 1 }}>
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          {calculatedItems.length === 0 ? (
            <div style={{ fontSize: 13, color: COLORS.textSecondary }}>No dishes added to this receipt.</div>
          ) : (
            calculatedItems.map((item) => (
              <div key={item.id} style={{ borderBottom: `1px solid ${COLORS.divider}`, paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.quantity} × {formatRand(item.price)}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{formatRand(item.itemTotal)}</div>
                </div>
              </div>
            ))
          )}

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>{formatRand(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 }}>
            <span>VAT ({taxRatePercent}%)</span>
            <span>{formatRand(tax)}</span>
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>{formatRand(total)}</span>
          </div>
        </div>

        <button onClick={onDone} style={primaryButtonStyle}>Done</button>
        <button onClick={onNewOrder} style={secondaryButtonStyle}>New Order</button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------
   App shell — wires every screen together with one navigation flow:

   Login → Loading → Menu Manager → Menu List ⇄ Dish Details ⇄ Add/Edit
                              ↓
                          Receipt

   A demo switcher above the phone frame lets you jump to any screen
   directly (handy for reviewing the Receipt screen, which the normal
   flow doesn't require passing through).
------------------------------------------------------------------------- */

type Screen = "login" | "loading" | "manager" | "menu" | "details" | "add" | "receipt";

const SCREEN_LABELS: Record<Screen, string> = {
  login: "Login",
  loading: "Loading",
  manager: "Home",
  menu: "Menu list",
  details: "Dish details",
  add: "Add / edit dish",
  receipt: "Receipt",
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  const selectedDish = dishes.find((d) => d.id === selectedDishId) ?? null;
  const editingDish = dishes.find((d) => d.id === editingDishId) ?? null;

  const stats: MenuStats = useMemo(
    () => ({
      total: dishes.length,
      starters: dishes.filter((d) => d.category === "Starters").length,
      mains: dishes.filter((d) => d.category === "Mains").length,
      desserts: dishes.filter((d) => d.category === "Desserts").length,
    }),
    [dishes]
  );

  const receiptItems: ReceiptItem[] = useMemo(
    () => dishes.slice(0, 3).map((d) => ({ id: d.id, name: d.name, quantity: 2, price: d.price })),
    [dishes]
  );

  const goToLoading = () => setScreen("loading");

  const handleSaveDish = (values: AddMenuItemSaveValue) => {
    const category = COURSE_TO_CATEGORY[values.course];
    if (editingDishId) {
      setDishes((prev) =>
        prev.map((d) => (d.id === editingDishId ? { ...d, ...values, category } : d))
      );
    } else {
      const newDish: Dish = {
        id: String(Date.now()),
        name: values.name,
        description: values.description,
        price: values.price,
        category,
        imagekeywords: values.name.split(" ").slice(0, 2).join(","),
      };
      setDishes((prev) => [...prev, newDish]);
    }
    setEditingDishId(null);
    setScreen("menu");
  };

  const handleDeleteDish = () => {
    setDishes((prev) => prev.filter((d) => d.id !== selectedDishId));
    setSelectedDishId(null);
    setScreen("menu");
  };

  let content: React.ReactNode;
  switch (screen) {
    case "login":
      content = (
        <LoginScreen
          onSignIn={goToLoading}
          onCreateAccount={goToLoading}
          onContinue={goToLoading}
        />
      );
      break;

    case "loading":
      content = <LoadingScreen onFinished={() => setScreen("manager")} />;
      break;

    case "manager":
      content = (
        <MenuManagerScreen
          stats={stats}
          onViewMenu={() => setScreen("menu")}
          onAddDish={() => {
            setEditingDishId(null);
            setScreen("add");
          }}
        />
      );
      break;

    case "menu":
      content = (
        <MenuListScreen
          items={dishes}
          onAddDish={() => {
            setEditingDishId(null);
            setScreen("add");
          }}
          onSelectDish={(id) => {
            setSelectedDishId(id);
            setScreen("details");
          }}
        />
      );
      break;

    case "details":
      content = selectedDish ? (
        <DishDetailsScreen
          dish={selectedDish}
          onBack={() => setScreen("menu")}
          onEdit={() => {
            setEditingDishId(selectedDish.id);
            setScreen("add");
          }}
          onDelete={handleDeleteDish}
          onViewReceipt={() => setScreen("receipt")}
        />
      ) : (
        <div style={FRAME_STYLE}>
          <div style={{ padding: 20, color: COLORS.textSecondary }}>No dish selected.</div>
        </div>
      );
      break;

    case "add":
      content = (
        <AddMenuItemScreen
          title={editingDish ? "Edit Menu Item" : "Add Menu Item"}
          initialValues={
            editingDish
              ? {
                  name: editingDish.name,
                  description: editingDish.description,
                  course: CATEGORY_TO_COURSE[editingDish.category],
                  price: String(editingDish.price),
                }
              : undefined
          }
          onSave={handleSaveDish}
          onCancel={() => {
            setEditingDishId(null);
            setScreen("menu");
          }}
        />
      );
      break;

    case "receipt":
      content = (
        <ReceiptScreen
          items={receiptItems}
          onDone={() => setScreen("manager")}
          onNewOrder={() => setScreen("menu")}
        />
      );
      break;

    default:
      content = null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 12px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {(Object.entries(SCREEN_LABELS) as [Screen, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setScreen(key)}
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 999,
              padding: "5px 12px",
              fontSize: 11.5,
              fontWeight: 600,
              backgroundColor: screen === key ? COLORS.primary : "#F7F8F7",
              color: screen === key ? COLORS.primaryText : COLORS.textSecondary,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {content}
    </div>
  );
};

export default App;