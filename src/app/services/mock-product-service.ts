import { Service } from '@angular/core';
import { IProduct } from '../model/IProduct';

@Service()
export class MockProductService {

    // Tableau de valeurs en local (remplace les appels au backend)
    private products: IProduct[] = [
        { id: '1', name: 'Clavier mécanique', description: 'Clavier RGB switches rouges', price: 89.99, category: 'peripherique', stock: 25 },
        { id: '2', name: 'Souris sans fil', description: 'Souris ergonomique 16000 DPI', price: 49.99, category: 'peripherique', stock: 40 },
        { id: '3', name: 'Écran 27"', description: 'Moniteur 144Hz QHD', price: 299.99, category: 'ecran', stock: 12 },
        { id: '4', name: 'Casque audio', description: 'Casque sans fil réduction de bruit', price: 159.99, category: 'audio', stock: 0 },
        { id: '5', name: 'Webcam HD', description: 'Webcam 1080p 60fps', price: 79.99, category: 'peripherique', stock: 18 },
        { id: '6', name: 'Clavier sans fil', description: 'Clavier compact Bluetooth', price: 39.99, category: 'peripherique', stock: 33 },
        { id: '7', name: 'Souris gaming', description: 'Souris filaire 8 boutons programmables', price: 59.99, category: 'peripherique', stock: 27 },
        { id: '8', name: 'Tapis de souris XXL', description: 'Tapis 900x400mm surface tissu', price: 24.99, category: 'peripherique', stock: 50 },
        { id: '9', name: 'Écran 24"', description: 'Moniteur Full HD 75Hz IPS', price: 149.99, category: 'ecran', stock: 20 },
        { id: '10', name: 'Écran 32" incurvé', description: 'Moniteur QHD 165Hz incurvé', price: 429.99, category: 'ecran', stock: 8 },
        { id: '11', name: 'Écran 4K 27"', description: 'Moniteur UHD 60Hz USB-C', price: 379.99, category: 'ecran', stock: 10 },
        { id: '12', name: 'Casque gaming', description: 'Casque filaire 7.1 surround micro', price: 89.99, category: 'audio', stock: 22 },
        { id: '13', name: 'Enceinte Bluetooth', description: 'Enceinte portable étanche 20W', price: 49.99, category: 'audio', stock: 35 },
        { id: '14', name: 'Barre de son', description: 'Barre de son 2.1 120W', price: 129.99, category: 'audio', stock: 15 },
        { id: '15', name: 'Écouteurs sans fil', description: 'Écouteurs intra-auriculaires TWS', price: 69.99, category: 'audio', stock: 45 },
        { id: '16', name: 'Micro USB', description: 'Microphone cardioïde streaming', price: 99.99, category: 'audio', stock: 14 },
        { id: '17', name: 'Disque SSD 1To', description: 'SSD NVMe M.2 lecture 3500Mo/s', price: 89.99, category: 'stockage', stock: 30 },
        { id: '18', name: 'Disque SSD 2To', description: 'SSD NVMe M.2 lecture 7000Mo/s', price: 179.99, category: 'stockage', stock: 18 },
        { id: '19', name: 'Disque dur externe 4To', description: 'HDD USB 3.0 portable', price: 109.99, category: 'stockage', stock: 25 },
        { id: '20', name: 'Clé USB 128Go', description: 'Clé USB 3.2 haute vitesse', price: 19.99, category: 'stockage', stock: 60 },
        { id: '21', name: 'Carte SD 256Go', description: 'Carte microSD classe 10 A2', price: 34.99, category: 'stockage', stock: 40 },
        { id: '22', name: 'Processeur 6 cœurs', description: 'CPU 3.6GHz socket AM4', price: 199.99, category: 'composant', stock: 12 },
        { id: '23', name: 'Processeur 8 cœurs', description: 'CPU 4.2GHz socket AM5', price: 349.99, category: 'composant', stock: 9 },
        { id: '24', name: 'Carte graphique RTX', description: 'GPU 12Go GDDR6 ray tracing', price: 699.99, category: 'composant', stock: 6 },
        { id: '25', name: 'Barrette RAM 16Go', description: 'DDR4 3200MHz CL16', price: 54.99, category: 'composant', stock: 28 },
        { id: '26', name: 'Barrette RAM 32Go', description: 'DDR5 5600MHz CL36', price: 129.99, category: 'composant', stock: 16 },
        { id: '27', name: 'Carte mère ATX', description: 'Carte mère socket AM5 WiFi 6', price: 219.99, category: 'composant', stock: 11 },
        { id: '28', name: 'Alimentation 750W', description: 'Alimentation modulaire 80+ Gold', price: 99.99, category: 'composant', stock: 19 },
        { id: '29', name: 'Ventirad CPU', description: 'Refroidisseur à air tour double', price: 44.99, category: 'composant', stock: 24 },
        { id: '30', name: 'Watercooling AIO', description: 'Refroidissement liquide 240mm', price: 89.99, category: 'composant', stock: 13 },
        { id: '31', name: 'Boîtier PC ATX', description: 'Tour moyenne verre trempé RGB', price: 79.99, category: 'composant', stock: 17 },
        { id: '32', name: 'Ventilateur RGB', description: 'Pack 3 ventilateurs 120mm ARGB', price: 39.99, category: 'composant', stock: 30 },
        { id: '33', name: 'Routeur WiFi 6', description: 'Routeur double bande AX3000', price: 119.99, category: 'reseau', stock: 20 },
        { id: '34', name: 'Switch réseau 8 ports', description: 'Switch Gigabit non manageable', price: 34.99, category: 'reseau', stock: 26 },
        { id: '35', name: 'Câble Ethernet 5m', description: 'Câble RJ45 Cat 7 blindé', price: 12.99, category: 'reseau', stock: 70 },
        { id: '36', name: 'Adaptateur USB WiFi', description: 'Clé WiFi 6 USB 3.0', price: 24.99, category: 'reseau', stock: 38 },
        { id: '37', name: 'Répéteur WiFi', description: 'Amplificateur de signal AC1200', price: 44.99, category: 'reseau', stock: 22 },
        { id: '38', name: 'Chaise gaming', description: 'Siège ergonomique inclinable', price: 199.99, category: 'mobilier', stock: 10 },
        { id: '39', name: 'Bureau assis-debout', description: 'Bureau réglable électrique 140cm', price: 349.99, category: 'mobilier', stock: 7 },
        { id: '40', name: 'Support écran double', description: 'Bras articulé VESA 2 écrans', price: 69.99, category: 'mobilier', stock: 21 },
        { id: '41', name: 'Repose-poignets', description: 'Repose-poignets ergonomique gel', price: 14.99, category: 'mobilier', stock: 44 },
        { id: '42', name: 'Lampe de bureau LED', description: 'Lampe articulée intensité réglable', price: 29.99, category: 'mobilier', stock: 33 },
        { id: '43', name: 'Hub USB-C 7-en-1', description: 'Station HDMI USB SD PD 100W', price: 49.99, category: 'accessoire', stock: 29 },
        { id: '44', name: 'Chargeur USB-C 65W', description: 'Chargeur GaN compact 3 ports', price: 34.99, category: 'accessoire', stock: 41 },
        { id: '45', name: 'Batterie externe 20000mAh', description: 'Powerbank charge rapide 22.5W', price: 39.99, category: 'accessoire', stock: 36 },
        { id: '46', name: 'Câble HDMI 2.1', description: 'Câble 8K 2m certifié', price: 17.99, category: 'accessoire', stock: 55 },
        { id: '47', name: 'Câble USB-C 1m', description: 'Câble tressé 100W 480Mbps', price: 9.99, category: 'accessoire', stock: 80 },
        { id: '48', name: 'Sac à dos PC 15"', description: 'Sac ordinateur résistant à l\'eau', price: 44.99, category: 'accessoire', stock: 23 },
        { id: '49', name: 'Onduleur 650VA', description: 'Onduleur ligne interactive UPS', price: 79.99, category: 'accessoire', stock: 12 },
        { id: '50', name: 'Kit nettoyage écran', description: 'Spray + microfibres pour écrans', price: 11.99, category: 'accessoire', stock: 48 },
        { id: '51', name: 'Manette sans fil', description: 'Manette Bluetooth PC compatible', price: 54.99, category: 'peripherique', stock: 26 },
        { id: '52', name: 'Volant de course', description: 'Volant à retour de force + pédalier', price: 249.99, category: 'peripherique', stock: 5 },
        { id: '53', name: 'Tablette graphique', description: 'Tablette dessin 10 pouces stylet', price: 79.99, category: 'peripherique', stock: 15 },
        { id: '54', name: 'Scanner à plat', description: 'Scanner photo A4 4800 dpi', price: 89.99, category: 'peripherique', stock: 9 },
        { id: '55', name: 'Imprimante laser', description: 'Imprimante monochrome recto-verso', price: 149.99, category: 'peripherique', stock: 11 },
    ];

    // Génère un nouvel id basé sur le max existant
    private generateId(): string {
        const maxId = this.products.reduce((max, p) => Math.max(max, Number(p.id)), 0);
        return String(maxId + 1);
    }

    getAllProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Produit introuvable (id: ${id})`);
        }
        return { ...product };
    }

    getProductByName(name: string): IProduct {
        const product = this.products.find(p => p.name === name);
        if (!product) {
            throw new Error(`Produit introuvable (name: ${name})`);
        }
        return { ...product };
    }

    getProductsByCategory(category: string): IProduct[] {
        return this.products.filter(p => p.category === category).map(p => ({ ...p }));
    }

    getProductsCategories(): string[] {
        return [...new Set(this.products.map(p => p.category))];
    }

    productExists(name: string): boolean {
        return this.products.some(p => p.name === name);
    }

    countProducts(): number {
        return this.products.length;
    }

    createProduct(product: Omit<IProduct, 'id'>): IProduct {
        const newProduct: IProduct = { ...product, id: this.generateId() };
        this.products.push(newProduct);
        return { ...newProduct };
    }

    updateProduct(id: string, product: Omit<IProduct, 'id'>): IProduct {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Produit introuvable (id: ${id})`);
        }
        const updated: IProduct = { ...product, id };
        this.products[index] = updated;
        return { ...updated };
    }

    deleteProductById(id: string): { message: string } {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Produit introuvable (id: ${id})`);
        }
        this.products.splice(index, 1);
        return { message: `Produit ${id} supprimé avec succès` };
    }

    deleteProductByName(name: string): { message: string } {
        const index = this.products.findIndex(p => p.name === name);
        if (index === -1) {
            throw new Error(`Produit introuvable (name: ${name})`);
        }
        this.products.splice(index, 1);
        return { message: `Produit ${name} supprimé avec succès` };
    }

}
