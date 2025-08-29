"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const crypto = __importStar(require("crypto"));
let ProductRepository = class ProductRepository {
    prisma;
    imagesDir;
    constructor(prisma) {
        this.prisma = prisma;
        this.imagesDir = path.join(__dirname, '..', '..', '..', 'product-service', 'products');
    }
    async findById(id) {
        return this.prisma.products.findUnique({ where: { id } });
    }
    async findByName(name) {
        const parsedName = name.split('-').slice(0, 2).join(' ');
        const products = await this.prisma.products.findMany({
            where: {
                name: {
                    startsWith: parsedName
                }
            }
        });
        if (!products.length) {
            throw new Error('Products not found');
        }
        const productIds = products.map(p => p.id);
        const attributes = await this.prisma.attributes.findMany({
            where: {
                productsId: {
                    in: productIds
                }
            }
        });
        const attributesMap = attributes.reduce((acc, attr) => {
            if (!acc[attr.productsId])
                acc[attr.productsId] = [];
            acc[attr.productsId].push(attr);
            return acc;
        }, {});
        return products.map(product => {
            console.log('product.id', product.id);
            console.log('attributesMap', attributesMap[product.id]);
            return {
                ...product,
                attributes: attributesMap[product.id]
            };
        });
    }
    async findAll() {
        const products = await this.prisma.products.findMany();
        const attributes = await this.prisma.attributes.findMany();
        const combined = products.map(product => {
            const matchingAttribute = attributes.find(attr => attr.productsId === product.id);
            const attributesObject = this.changeArrToObj(matchingAttribute);
            return {
                ...product,
                attributes: attributesObject
            };
        });
        return combined;
    }
    changeArrToObj(arr) {
        const attributesObject = arr
            ? Object.fromEntries([
                ["productsId", arr.productsId],
                ["type", arr.type],
                ["category", arr.category],
                ["color", arr.color],
                ["size", arr.size]
            ])
            : {};
        return attributesObject;
    }
    async editProduct(data) {
        console.log('editing product .....');
        const attributes = JSON.parse(data?.attributes);
        try {
            if (typeof data.file === 'object') {
                await this.editImage(data.file, data.image);
            }
        }
        catch (error) {
            console.error('Error editing image:', error);
        }
        return this.prisma.products.update({
            where: { id: data.id },
            data: {
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: +data.price,
                discount: +data.discount,
                attributes: {
                    update: [
                        {
                            where: { productsId: attributes.productsId },
                            data: {
                                type: attributes.type,
                                category: attributes.category,
                                color: attributes.color,
                                size: attributes.size,
                            }
                        }
                    ],
                }
            },
        });
    }
    async addImage(file, prodId) {
        const fileHash = await crypto
            .createHash('sha256')
            .update(file.originalname + Date.now())
            .digest('hex');
        const extension = path.extname(file.originalname);
        const fileName = `${fileHash}${extension}`;
        const filePath = path.join(this.imagesDir, fileName);
        if (extension !== '.webp')
            throw new Error('Only .webp allowed');
        const buffer = Buffer.isBuffer(file.buffer)
            ? file.buffer
            : Buffer.from(file.buffer.data);
        try {
            try {
                await fs.access(this.imagesDir);
            }
            catch {
                await fs.mkdir(this.imagesDir, { recursive: true });
            }
            try {
                await fs.access(filePath);
                throw new Error('File already exists');
            }
            catch {
            }
            await fs.writeFile(filePath, buffer);
            try {
                await fs.access(filePath);
            }
            catch {
                return { success: false };
            }
            await this.prisma.products.update({
                where: { id: prodId },
                data: {
                    image: `http://localhost:5000/products/${fileName}`,
                },
            });
            return { success: true };
        }
        catch (error) {
            console.error('Add image error:', error);
            return { success: false, message: error.message, fileHash };
        }
    }
    async addProduct(data) {
        const attributes = JSON.parse(data.attributes);
        const createdProduct = await this.prisma.products.create({
            data: {
                name: data.name,
                description: data.description,
                price: +data.price,
                discount: +data.discount,
                brand: 'Generic Brand',
                image: '',
                attributes: {
                    create: [
                        {
                            type: attributes.type,
                            category: attributes.category,
                            color: attributes.color,
                            size: attributes.size,
                            material: 'Generic Material',
                            countryOfOrigin: 'Generic Country',
                            weight: 0,
                        }
                    ],
                }
            }
        });
        const fileHash = await (await this.addImage(data.image, createdProduct.id)).fileHash;
        if (fileHash) {
            await this.prisma.products.update({
                where: { id: createdProduct.id },
                data: {
                    image: `http://localhost:5000/products/${fileHash}.webp`
                }
            });
        }
    }
    async editImage(file, imageURL) {
        const fileName = path.basename(imageURL, path.extname(imageURL));
        const fileExtname = path.extname(file.originalname);
        if (fileExtname !== '.webp')
            throw new Error('Only .webp allowed');
        if (!fileName)
            throw new Error('Invalid imageURL format');
        const filePath = path.join(this.imagesDir, `${fileName}${fileExtname}`);
        try {
            await fs.access(filePath);
            await fs.rm(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Помилка видалення:', err);
                throw new Error('Error deleting old image');
            }
        }
        try {
            const buffer = Buffer.isBuffer(file.buffer)
                ? file.buffer
                : Buffer.from(file.buffer.data);
            await fs.writeFile(filePath, buffer);
            console.log('Успішно записано!');
        }
        catch (err) {
            console.error('Помилка запису файлу:', err);
            throw new Error('Error writing new image');
        }
        return { success: true };
    }
    async deleteImage(imageURL) {
        const fileName = path.basename(imageURL);
        const filePath = path.join(this.imagesDir, fileName);
        try {
            await fs.rm(filePath, { force: true });
            return { success: true, message: 'Image deleted successfully' };
        }
        catch (err) {
            throw new Error(`Failed to delete image "${filePath}": ${err.message}`);
        }
    }
    async deleteProduct(id) {
        let product;
        let attribute;
        try {
            product = await this.prisma.products.findUnique({ where: { id } });
            attribute = await this.prisma.attributes.findUnique({ where: { productsId: id } });
            if (!product)
                throw new Error(`Product with id ${id} not found`);
            if (!attribute)
                throw new Error(`Attributes with id ${id} not found`);
        }
        catch (err) {
            throw new Error(`DB fetch error: ${err.message}`);
        }
        try {
            await this.prisma.products.delete({ where: { id } });
            await this.prisma.attributes.delete({ where: { productsId: id } });
        }
        catch (err) {
            throw new Error(`Failed to delete product: ${err.message}`);
        }
        if (product.image) {
            try {
                await this.deleteImage(product.image);
            }
            catch (err) {
                console.error(`Warning: Image deletion failed: ${err.message}`);
            }
        }
        return { success: true, message: 'Product and image (if existed) deleted successfully' };
    }
    async deleteProductById(id) {
        const data = await this.prisma.products.findUnique({ where: { id: id } });
        if (!data) {
            throw new Error(`Product with id ${id} not found`);
        }
        const fileName = path.basename(data.image);
        try {
            await this.prisma.attributes.delete({ where: { productsId: data.id } });
        }
        catch (error) {
            throw new Error(`Failed to delete attributes for product with id ${data.id}: ${error.message}`);
        }
        try {
            await this.prisma.products.delete({ where: { id: data.id } });
        }
        catch (error) {
            throw new Error(`Failed to delete product with id ${data.id}: ${error.message}`);
        }
        try {
            await fs.rm(path.join(this.imagesDir, fileName), { force: true });
        }
        catch (error) {
            throw new Error(`Failed to delete image with product id ${data.id}. Image name - ${fileName}: ${error.message}`);
        }
        return { success: true, message: 'Product and image deleted successfully' };
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map