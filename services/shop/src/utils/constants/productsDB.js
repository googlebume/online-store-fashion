import hoodie_1_1 from '@/assets/images/products/hoodie_1_1.webp'
import hoodie_2_1 from '@/assets/images/products/hoodie_2_1.webp'
import hoodie_3_1 from '@/assets/images/products/hoodie_3_1.webp'
import hoodie_4_1 from '@/assets/images/products/hoodie_4_1.webp'
import hoodie_5_1 from '@/assets/images/products/hoodie_5_1.webp'

import tshirt_1_1 from '@/assets/images/products/tshirt_1_1.webp'
import tshirt_2_1 from '@/assets/images/products/tshirt_2_1.webp'
import tshirt_3_1 from '@/assets/images/products/tshirt_3_1.webp'
import tshirt_4_1 from '@/assets/images/products/tshirt_4_1.webp'
import tshirt_5_1 from '@/assets/images/products/tshirt_5_1.webp'

const productsDB = [
    // Худі (Hoodie) - 5 товарів
    { name: "Oversize Hoodie", category: "male", type: "hoodie", color: "black", price: 1200, discount: 15, image: hoodie_1_1 },
    { name: "Casual Hoodie", category: "male", type: "hoodie", color: "white", price: 1100, discount: 10, image: hoodie_2_1 },
    { name: "Sporty Hoodie", category: "female", type: "hoodie", color: "white", price: 1300, discount: 20, image: hoodie_3_1 },
    { name: "Streetwear Hoodie", category: "male", type: "hoodie", color: "black", price: 1250, discount: 5, image: hoodie_4_1 },
    { name: "Minimalist Hoodie", category: "male", type: "hoodie", color: "yellow", price: 1150, discount: 10, image: hoodie_5_1 },
  
    // Світшоти (Sweatshirt) - 5 товарів
    { name: "Classic Sweatshirt", category: "female", type: "sweatshirt", color: "beige", price: 1000, discount: 12, image: "" },
    { name: "Urban Sweatshirt", category: "male", type: "sweatshirt", color: "navy", price: 1050, discount: 8, image: "" },
    { name: "Vintage Sweatshirt", category: "male", type: "sweatshirt", color: "brown", price: 1100, discount: 15, image: "" },
    { name: "Comfy Sweatshirt", category: "female", type: "sweatshirt", color: "pink", price: 980, discount: 10, image: "" },
    { name: "Trendy Sweatshirt", category: "female", type: "sweatshirt", color: "yellow", price: 1020, discount: 7, image: "" },
  
    // Рубашки (Shirt) - 5 товарів
    { name: "Formal Shirt", category: "male", type: "shirt", color: "white", price: 1500, discount: 18, image: "" },
    { name: "Casual Shirt", category: "female", type: "shirt", color: "light blue", price: 1350, discount: 12, image: "" },
    { name: "Linen Shirt", category: "male", type: "shirt", color: "olive", price: 1450, discount: 10, image: "" },
    { name: "Denim Shirt", category: "female", type: "shirt", color: "blue", price: 1400, discount: 15, image: "" },
    { name: "Plaid Shirt", category: "male", type: "shirt", color: "red", price: 1300, discount: 20, image: "" },
  
    // Футболки (T-shirt) - 5 товарів
    { name: "Basic T-shirt", category: "female", type: "tshirt", color: "pirple", price: 800, discount: 5, image: tshirt_1_1 },
    //https://uamade.net/ua/p2182746448-bazovaya-odnotonnaya-oversajz.html?source=merchant_center&srsltid=AfmBOopq0eZP_h3ASmpDMqLeTT1JM45FFWJ2DLhR-eFO3qhscOAY4ZFWYYk
    { name: "Graphic T-shirt", category: "female", type: "tshirt", color: "black", price: 850, discount: 10, image: tshirt_2_1 },
    { name: "Sport T-shirt", category: "male", type: "tshirt", color: "green", price: 900, discount: 12, image: tshirt_3_1 },
    { name: "Slim Fit T-shirt", category: "female", type: "tshirt", color: "gray", price: 880, discount: 8, image: tshirt_4_1 },
    { name: "Vintage T-shirt", category: "male", type: "tshirt", color: "burgundy", price: 950, discount: 15, image: tshirt_5_1 }
    //https://www.temu.com/ua-ru/%D0%B3%D0%BE%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9--%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F-%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%BA%D0%B0-%D1%81-%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%BC-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%BE%D0%BC-%D0%BF%D0%BE%D0%B2%D1%81%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D1%8B%D0%B5-%D1%83%D0%B4%D0%BE%D0%B1%D0%BD%D1%8B%D0%B5-%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F--%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B4%D0%B5%D0%B6%D0%B4%D0%B0-%D1%82%D0%BE%D0%BF%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%B5%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BE%D1%82%D0%B4%D1%8B%D1%85%D0%B0-%D0%BD%D0%B0-%D0%BA%D1%83%D1%80%D0%BE%D1%80%D1%82%D0%B0%D1%85-g-601099561234806.html?top_gallery_url=https%3A%2F%2Fimg.kwcdn.com%2Fproduct%2Ffancy%2Fac76ede9-18bc-4783-88e1-a34c825587d2.jpg&spec_id=15071&spec_gallery_id=2988&spec_ids=15071%2C3002&share_token=u7G2ugIj5zszWiCdGxyQcSLVo_twig2LFXhVs9le9svy0BG4zaHSRRpgzNxKrWukx5NZh9hUqbQCKghQwiZs2LXkXKtQHgpYJvYGHWORdcQ99fyZPSwCEBU-hsYBq5GFxTnB1b-9x8M_ODZGyEKujC&_x_vst_scene=adg&_x_ads_sub_channel=shopping&_x_ns_prz_type=-1&_x_ns_sku_id=17592398499650&_x_ns_gid=601099561234806&_x_ads_channel=google&_x_gmc_account=5343777111&_x_login_type=Google&_x_ads_account=8661564203&_x_ads_set=21860125140&_x_ads_id=172645853191&_x_ads_creative_id=719527030065&_x_ns_source=g&_x_ns_gclid=Cj0KCQiAkoe9BhDYARIsAH85cDOfC0hSs6KHkTnhG3N-aF25fejzB6YBarLv4_z8Gr26L5JH1YN5ADcaAs_UEALw_wcB&_x_ns_placement=&_x_ns_match_type=&_x_ns_ad_position=&_x_ns_product_id=17592398499650&_x_ns_target=&_x_ns_devicemodel=&_x_ns_wbraid=Cj4KCAiA74G9BhBOEi4A6fzLL-a5j8FijTMplcTV9Dycb7g13OF9Cc4cTEMELOaIaEBBdNnhzp3cRADxGgJSgA&_x_ns_gbraid=0AAAAAo4mICFrtrFajbpJpcZO5Ry9QNzsy&_x_ns_targetid=pla-2366581315111&refer_page_name=kuiper&refer_page_id=13554_1738682127105_q7hzna8y0c&refer_page_sn=13554&_x_sessn_id=5nhntnefcy
  ];
  
  export default productsDB;
  