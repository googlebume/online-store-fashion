import axios from 'axios';

const API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const API_KEY = '7f82d5b07b5b8272d3630cccc7af95a6';

interface NovaPoshtaResponse<T> {
    success: boolean;
    data: T[];
    errors: string[];
    warnings: string[];
    info: any;
}

interface Area {
    Ref: string;
    AreasCenter: string;
    Description: string;
}

interface City {
    Ref: string;
    Description: string;
    Area: string;
    SettlementType: string;
    IsBranch: string;
}

interface Warehouse {
    Ref: string;
    Description: string;
    ShortAddress: string;
    Number: string;
    CityRef: string;
}

class NovaPoshtaService {
    private async sendRequest<T>(modelName: string, calledMethod: string, methodProperties: any = {}): Promise<T[]> {
        try {
            const response = await axios.post<NovaPoshtaResponse<T>>(API_URL, {
                apiKey: API_KEY,
                modelName,
                calledMethod,
                methodProperties,
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                console.error('Nova Poshta API error:', response.data.errors);
                return [];
            }
        } catch (error) {
            console.error('Error fetching data from Nova Poshta:', error);
            return [];
        }
    }

    async getAreas(): Promise<Area[]> {
        return this.sendRequest<Area>('Address', 'getAreas');
    }

    async getCities(areaRef?: string): Promise<City[]> {
        return this.sendRequest<City>('Address', 'getCities', {
            AreaRef: areaRef || '',
        });
    }

    async getWarehouses(cityRef: string): Promise<Warehouse[]> {
        return this.sendRequest<Warehouse>('AddressGeneral', 'getWarehouses', {
            CityRef: cityRef,
        });
    }

    // Допоміжні методи для отримання тільки назв
    async getAreaNames(): Promise<{ ref: string, name: string }[]> {
        const areas = await this.getAreas();
        return areas.map(area => ({
            ref: area.Ref,
            name: area.Description,
        }));
    }

    async getCityNames(areaRef?: string): Promise<{ ref: string, name: string }[]> {
        const cities = await this.getCities(areaRef);
        return cities.map(city => ({
            ref: city.Ref,
            name: city.Description,
        }));
    }

    async getWarehouseNames(cityRef: string): Promise<{ ref: string, name: string }[]> {
        const warehouses = await this.getWarehouses(cityRef);
        return warehouses.map(warehouse => ({
            ref: warehouse.Ref,
            name: `${warehouse.Description} (№${warehouse.Number})`,
        }));
    }
}

export const novaPoshtaService = new NovaPoshtaService();
export default novaPoshtaService;