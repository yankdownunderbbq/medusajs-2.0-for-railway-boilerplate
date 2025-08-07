import Medusa from "@medusajs/medusa-js";

async function seedProduct(medusa) {
  const productData = {
    title: "Sliced Brisket",
    handle: "sliced-brisket",
    status: "published",
    description:
      "I slow smoke this beauty for 12+ hours over Iron Bark until it’s tender enough to slice with a look. Great in sandwiches, tacos, or straight out of the bag. However you eat it, this is proper brisket done right.",
    type: {
      value: "bbq",
    },
    tags: [
      { value: "brisket" },
      { value: "wagyu" },
      { value: "sliced" },
    ],
    images: [
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/briskethash.jpeg",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/brisketmoneyshot.jpg",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/brisketsandwich.webp",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/chopped.avif",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/intacos.jpeg",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/licensed-image.jpeg",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/ontoast.jpeg",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/vaccumsealed.webp",
      "https://bucket-production-fd15.up.railway.app/my-app-assets/products/sliced-brisket/vaccum-sealed-brisket.jpg",
    ],
    options: [
      {
        title: "Weight",
        values: ["100g Tray", "250g Tray", "300g Tray", "500g Tray"],
      },
    ],
    variants: [
      {
        title: "100g Tray",
        sku: "sliced-brisket-100g",
        inventory_quantity: 100,
        options: [{ value: "100g Tray" }],
        prices: [{ currency_code: "AUD", amount: 1000 }],
      },
      {
        title: "250g Tray",
        sku: "sliced-brisket-250g",
        inventory_quantity: 100,
        options: [{ value: "250g Tray" }],
        prices: [{ currency_code: "AUD", amount: 2500 }],
      },
      {
        title: "300g Tray",
        sku: "sliced-brisket-300g",
        inventory_quantity: 100,
        options: [{ value: "300g Tray" }],
        prices: [{ currency_code: "AUD", amount: 2200 }],
      },
      {
        title: "500g Tray",
        sku: "sliced-brisket-500g",
        inventory_quantity: 100,
        options: [{ value: "500g Tray" }],
        prices: [{ currency_code: "AUD", amount: 5000 }],
      },
    ],
    metadata: {
      ingredients:
        "We source marble score 5+ Australian Wagyu from local producers. Seasoned Texas-style — just salt and pepper — and slow smoked for 12+ hours.",
      backstory:
        "Texas BBQ — especially brisket — has taken the world by storm. But in the States, we’ve been smoking brisket like this for generations. This is my version of that tradition — the real deal, done low and slow.",
      features: [
        {
          icon: "https://bucket-production-fd15.up.railway.app/my-app-assets/svgicons/clock-nine-svgrepo-com.svg",
          label: "12+ Hour Smoked",
        },
        {
          icon: "https://bucket-production-fd15.up.railway.app/my-app-assets/svgicons/leaf-svgrepo-com.svg",
          label: "Locally Sourced",
        },
        {
          icon: "https://bucket-production-fd15.up.railway.app/my-app-assets/svgicons/fire-svgrepo-com.svg",
          label: "Iron Bark Hardwood",
        },
      ],
    },
  };

  try {
    const product = await medusa.admin.products.create(productData);
    console.log("Product created:", product.id);
  } catch (error) {
    console.error("Failed to create product:", error);
  }
}

async function run() {
  const MEDUSA_BACKEND_URL = "http://localhost:9000";
  const ADMIN_EMAIL = "reggieljames@gmail.com";
  const ADMIN_PASSWORD = "iSchool09"; 

  const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

  try {
    // Authenticate using the ADMIN API
    await medusa.admin.auth({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    console.log("Admin authentication successful.");

    await seedProduct(medusa);
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

run();