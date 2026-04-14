process.env.DATABASE_URL = 'postgresql://postgres:menuFamiliar1@localhost:5432/menu_familiar';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed...');
    // ── INGREDIENTES BASE ─────────────────────────────────────────────────────
    const ingredients = await Promise.all([
        // Carnes
        prisma.ingredient.upsert({ where: { name: 'pechuga de pollo' }, update: {}, create: { name: 'pechuga de pollo', category: 'carnes', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'muslo de pollo' }, update: {}, create: { name: 'muslo de pollo', category: 'carnes', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'carne picada' }, update: {}, create: { name: 'carne picada', category: 'carnes', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'bife de chorizo' }, update: {}, create: { name: 'bife de chorizo', category: 'carnes', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'merluza' }, update: {}, create: { name: 'merluza', category: 'pescados', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'atún en lata' }, update: {}, create: { name: 'atún en lata', category: 'pescados', unit: 'gr' } }),
        // Verduras
        prisma.ingredient.upsert({ where: { name: 'tomate' }, update: {}, create: { name: 'tomate', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'cebolla' }, update: {}, create: { name: 'cebolla', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'morrón rojo' }, update: {}, create: { name: 'morrón rojo', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'zapallito' }, update: {}, create: { name: 'zapallito', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'zanahoria' }, update: {}, create: { name: 'zanahoria', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'papa' }, update: {}, create: { name: 'papa', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'choclo' }, update: {}, create: { name: 'choclo', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'espinaca' }, update: {}, create: { name: 'espinaca', category: 'verduras', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'lechuga' }, update: {}, create: { name: 'lechuga', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'brócoli' }, update: {}, create: { name: 'brócoli', category: 'verduras', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'berenjena' }, update: {}, create: { name: 'berenjena', category: 'verduras', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'ajo' }, update: {}, create: { name: 'ajo', category: 'verduras', unit: 'diente' } }),
        // Secos y almacén
        prisma.ingredient.upsert({ where: { name: 'fideos spaghetti' }, update: {}, create: { name: 'fideos spaghetti', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'fideos mostachol' }, update: {}, create: { name: 'fideos mostachol', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'arroz' }, update: {}, create: { name: 'arroz', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'lentejas' }, update: {}, create: { name: 'lentejas', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'garbanzos' }, update: {}, create: { name: 'garbanzos', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'pan rallado' }, update: {}, create: { name: 'pan rallado', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'harina' }, update: {}, create: { name: 'harina', category: 'secos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'tomate triturado' }, update: {}, create: { name: 'tomate triturado', category: 'conservas', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'arveja en lata' }, update: {}, create: { name: 'arveja en lata', category: 'conservas', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'caldo de pollo' }, update: {}, create: { name: 'caldo de pollo', category: 'conservas', unit: 'ml' } }),
        // Lácteos
        prisma.ingredient.upsert({ where: { name: 'queso rallado' }, update: {}, create: { name: 'queso rallado', category: 'lácteos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'queso mozzarella' }, update: {}, create: { name: 'queso mozzarella', category: 'lácteos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'crema de leche' }, update: {}, create: { name: 'crema de leche', category: 'lácteos', unit: 'ml' } }),
        prisma.ingredient.upsert({ where: { name: 'huevo' }, update: {}, create: { name: 'huevo', category: 'lácteos', unit: 'unidad' } }),
        prisma.ingredient.upsert({ where: { name: 'masa de tarta' }, update: {}, create: { name: 'masa de tarta', category: 'lácteos', unit: 'unidad' } }),
        // Condimentos
        prisma.ingredient.upsert({ where: { name: 'aceite de oliva' }, update: {}, create: { name: 'aceite de oliva', category: 'condimentos', unit: 'ml' } }),
        prisma.ingredient.upsert({ where: { name: 'albahaca' }, update: {}, create: { name: 'albahaca', category: 'condimentos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'orégano' }, update: {}, create: { name: 'orégano', category: 'condimentos', unit: 'gr' } }),
        prisma.ingredient.upsert({ where: { name: 'pimentón' }, update: {}, create: { name: 'pimentón', category: 'condimentos', unit: 'gr' } }),
    ]);
    // Mapa para acceder por nombre fácilmente
    const ing = Object.fromEntries(ingredients.map(i => [i.name, i]));
    console.log(`✅ ${ingredients.length} ingredientes creados`);
    // ── RECETAS ───────────────────────────────────────────────────────────────
    const recipeData = [
        {
            name: 'Milanesas de pollo al horno',
            prepMinutes: 35,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-milanesas-de-pollo-al-horno',
            tags: ['pollo', 'horno', 'familiar', 'sin_lactosa'],
            costEstimate: 1200,
            ingredients: [
                { name: 'pechuga de pollo', quantity: 600, unit: 'gr' },
                { name: 'pan rallado', quantity: 150, unit: 'gr' },
                { name: 'huevo', quantity: 2, unit: 'unidad' },
                { name: 'ajo', quantity: 2, unit: 'diente' },
                { name: 'orégano', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Spaghetti con salsa de tomate y albahaca',
            prepMinutes: 20,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-spaghetti-con-salsa-de-tomate',
            tags: ['pasta', 'vegetarian', 'rapido', 'familiar'],
            costEstimate: 600,
            ingredients: [
                { name: 'fideos spaghetti', quantity: 400, unit: 'gr' },
                { name: 'tomate triturado', quantity: 400, unit: 'gr' },
                { name: 'ajo', quantity: 3, unit: 'diente' },
                { name: 'albahaca', quantity: 10, unit: 'gr' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
                { name: 'queso rallado', quantity: 50, unit: 'gr' },
            ]
        },
        {
            name: 'Arroz con pollo y verduras',
            prepMinutes: 40,
            difficulty: 'medium',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-arroz-con-pollo',
            tags: ['pollo', 'arroz', 'familiar', 'sin_lactosa'],
            costEstimate: 1100,
            ingredients: [
                { name: 'muslo de pollo', quantity: 600, unit: 'gr' },
                { name: 'arroz', quantity: 300, unit: 'gr' },
                { name: 'morrón rojo', quantity: 1, unit: 'unidad' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'arveja en lata', quantity: 200, unit: 'gr' },
                { name: 'caldo de pollo', quantity: 500, unit: 'ml' },
                { name: 'pimentón', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Tarta de zapallito y choclo',
            prepMinutes: 45,
            difficulty: 'medium',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-tarta-de-zapallito',
            tags: ['tarta', 'vegetarian', 'familiar', 'verduras'],
            costEstimate: 800,
            ingredients: [
                { name: 'masa de tarta', quantity: 1, unit: 'unidad' },
                { name: 'zapallito', quantity: 3, unit: 'unidad' },
                { name: 'choclo', quantity: 2, unit: 'unidad' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'huevo', quantity: 3, unit: 'unidad' },
                { name: 'queso rallado', quantity: 80, unit: 'gr' },
                { name: 'crema de leche', quantity: 100, unit: 'ml' },
            ]
        },
        {
            name: 'Bife a la criolla',
            prepMinutes: 30,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-bife-a-la-criolla',
            tags: ['carne', 'familiar', 'sin_lactosa'],
            costEstimate: 1800,
            ingredients: [
                { name: 'bife de chorizo', quantity: 600, unit: 'gr' },
                { name: 'tomate', quantity: 3, unit: 'unidad' },
                { name: 'cebolla', quantity: 2, unit: 'unidad' },
                { name: 'morrón rojo', quantity: 1, unit: 'unidad' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
                { name: 'orégano', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Mostachol con salsa bolognesa',
            prepMinutes: 35,
            difficulty: 'medium',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-bolognesa',
            tags: ['pasta', 'carne', 'familiar'],
            costEstimate: 1000,
            ingredients: [
                { name: 'fideos mostachol', quantity: 400, unit: 'gr' },
                { name: 'carne picada', quantity: 400, unit: 'gr' },
                { name: 'tomate triturado', quantity: 400, unit: 'gr' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'ajo', quantity: 2, unit: 'diente' },
                { name: 'zanahoria', quantity: 1, unit: 'unidad' },
                { name: 'queso rallado', quantity: 50, unit: 'gr' },
            ]
        },
        {
            name: 'Lentejas guisadas',
            prepMinutes: 40,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-lentejas-guisadas',
            tags: ['legumbres', 'vegetarian', 'vegan', 'sin_lactosa', 'economico'],
            costEstimate: 400,
            ingredients: [
                { name: 'lentejas', quantity: 300, unit: 'gr' },
                { name: 'zanahoria', quantity: 2, unit: 'unidad' },
                { name: 'papa', quantity: 2, unit: 'unidad' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'tomate triturado', quantity: 200, unit: 'gr' },
                { name: 'pimentón', quantity: 5, unit: 'gr' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
            ]
        },
        {
            name: 'Pollo al verdeo con papas',
            prepMinutes: 45,
            difficulty: 'medium',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-pollo-al-verdeo',
            tags: ['pollo', 'familiar', 'sin_lactosa'],
            costEstimate: 1300,
            ingredients: [
                { name: 'muslo de pollo', quantity: 700, unit: 'gr' },
                { name: 'papa', quantity: 4, unit: 'unidad' },
                { name: 'cebolla', quantity: 2, unit: 'unidad' },
                { name: 'caldo de pollo', quantity: 300, unit: 'ml' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
            ]
        },
        {
            name: 'Tarta de espinaca y ricota',
            prepMinutes: 50,
            difficulty: 'medium',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-tarta-de-espinaca',
            tags: ['tarta', 'vegetarian', 'verduras', 'familiar'],
            costEstimate: 900,
            ingredients: [
                { name: 'masa de tarta', quantity: 1, unit: 'unidad' },
                { name: 'espinaca', quantity: 300, unit: 'gr' },
                { name: 'huevo', quantity: 3, unit: 'unidad' },
                { name: 'queso rallado', quantity: 80, unit: 'gr' },
                { name: 'crema de leche', quantity: 100, unit: 'ml' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
            ]
        },
        {
            name: 'Hamburguesas caseras con ensalada',
            prepMinutes: 25,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-hamburguesas-caseras',
            tags: ['carne', 'rapido', 'familiar'],
            costEstimate: 1400,
            ingredients: [
                { name: 'carne picada', quantity: 500, unit: 'gr' },
                { name: 'huevo', quantity: 1, unit: 'unidad' },
                { name: 'pan rallado', quantity: 50, unit: 'gr' },
                { name: 'lechuga', quantity: 1, unit: 'unidad' },
                { name: 'tomate', quantity: 2, unit: 'unidad' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
            ]
        },
        {
            name: 'Guiso de garbanzos con verduras',
            prepMinutes: 40,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-guiso-de-garbanzos',
            tags: ['legumbres', 'vegetarian', 'vegan', 'sin_lactosa', 'economico'],
            costEstimate: 500,
            ingredients: [
                { name: 'garbanzos', quantity: 300, unit: 'gr' },
                { name: 'papa', quantity: 2, unit: 'unidad' },
                { name: 'zanahoria', quantity: 2, unit: 'unidad' },
                { name: 'tomate triturado', quantity: 400, unit: 'gr' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'morrón rojo', quantity: 1, unit: 'unidad' },
                { name: 'pimentón', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Merluza al horno con papas',
            prepMinutes: 35,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-merluza-al-horno',
            tags: ['pescado', 'sin_lactosa', 'horno', 'liviano'],
            costEstimate: 1100,
            ingredients: [
                { name: 'merluza', quantity: 600, unit: 'gr' },
                { name: 'papa', quantity: 4, unit: 'unidad' },
                { name: 'tomate', quantity: 2, unit: 'unidad' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
                { name: 'orégano', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Pasta con atún y tomate',
            prepMinutes: 15,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-pasta-con-atun',
            tags: ['pasta', 'pescado', 'rapido', 'sin_lactosa'],
            costEstimate: 700,
            ingredients: [
                { name: 'fideos spaghetti', quantity: 400, unit: 'gr' },
                { name: 'atún en lata', quantity: 160, unit: 'gr' },
                { name: 'tomate triturado', quantity: 300, unit: 'gr' },
                { name: 'ajo', quantity: 2, unit: 'diente' },
                { name: 'aceite de oliva', quantity: 20, unit: 'ml' },
                { name: 'orégano', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Pollo al horno con morrón y papas',
            prepMinutes: 60,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-pollo-al-horno',
            tags: ['pollo', 'horno', 'familiar', 'sin_lactosa'],
            costEstimate: 1400,
            ingredients: [
                { name: 'muslo de pollo', quantity: 800, unit: 'gr' },
                { name: 'papa', quantity: 4, unit: 'unidad' },
                { name: 'morrón rojo', quantity: 2, unit: 'unidad' },
                { name: 'ajo', quantity: 4, unit: 'diente' },
                { name: 'aceite de oliva', quantity: 40, unit: 'ml' },
                { name: 'pimentón', quantity: 5, unit: 'gr' },
                { name: 'orégano', quantity: 5, unit: 'gr' },
            ]
        },
        {
            name: 'Revuelto gramajo',
            prepMinutes: 20,
            difficulty: 'easy',
            recipeUrl: 'https://www.recetasgratis.net/receta-de-revuelto-gramajo',
            tags: ['carne', 'rapido', 'familiar', 'sin_lactosa'],
            costEstimate: 900,
            ingredients: [
                { name: 'papa', quantity: 4, unit: 'unidad' },
                { name: 'huevo', quantity: 4, unit: 'unidad' },
                { name: 'carne picada', quantity: 300, unit: 'gr' },
                { name: 'cebolla', quantity: 1, unit: 'unidad' },
                { name: 'aceite de oliva', quantity: 30, unit: 'ml' },
            ]
        },
    ];
    // Crear recetas
    let recipeCount = 0;
    for (const data of recipeData) {
        const existing = await prisma.recipe.findFirst({ where: { name: data.name } });
        if (existing)
            continue;
        await prisma.recipe.create({
            data: {
                name: data.name,
                prepMinutes: data.prepMinutes,
                difficulty: data.difficulty,
                recipeUrl: data.recipeUrl,
                tags: data.tags,
                costEstimate: data.costEstimate,
                ingredients: {
                    create: data.ingredients.map(i => ({
                        ingredientId: ing[i.name].id,
                        quantity: i.quantity,
                        unit: i.unit
                    }))
                }
            }
        });
        recipeCount++;
    }
    console.log(`✅ ${recipeCount} recetas creadas`);
    // ── FAMILIA DE EJEMPLO ────────────────────────────────────────────────────
    const existingFamily = await prisma.family.findFirst({
        where: { name: 'Los García (demo)' }
    });
    if (!existingFamily) {
        // Usuario demo
        const demoUser = await prisma.user.upsert({
            where: { email: 'demo@menufamiliar.app' },
            update: {},
            create: { email: 'demo@menufamiliar.app' }
        });
        const family = await prisma.family.create({
            data: {
                name: 'Los García (demo)',
                ownerId: demoUser.id,
                members: {
                    create: [
                        {
                            name: 'Papá',
                            preferences: {
                                create: [
                                    { foodTag: 'carne', score: 1 },
                                    { foodTag: 'pasta', score: 1 },
                                    { foodTag: 'pescado', score: -1 },
                                ]
                            },
                            restrictions: { create: [] }
                        },
                        {
                            name: 'Mamá',
                            preferences: {
                                create: [
                                    { foodTag: 'verduras', score: 1 },
                                    { foodTag: 'pollo', score: 1 },
                                    { foodTag: 'liviano', score: 1 },
                                ]
                            },
                            restrictions: {
                                create: [{ type: 'lactose_free' }]
                            }
                        },
                        {
                            name: 'Sofía (10 años)',
                            preferences: {
                                create: [
                                    { foodTag: 'pasta', score: 1 },
                                    { foodTag: 'pollo', score: 1 },
                                    { foodTag: 'tarta', score: -1 },
                                ]
                            },
                            restrictions: { create: [] }
                        },
                        {
                            name: 'Mateo (7 años)',
                            preferences: {
                                create: [
                                    { foodTag: 'pasta', score: 1 },
                                    { foodTag: 'familiar', score: 1 },
                                    { foodTag: 'legumbres', score: -1 },
                                ]
                            },
                            restrictions: { create: [] }
                        },
                    ]
                }
            },
            include: { members: true }
        });
        console.log(`✅ Familia demo "${family.name}" creada con ${family.members.length} miembros`);
    }
    else {
        console.log('ℹ️  Familia demo ya existe, saltando...');
    }
    console.log('🎉 Seed completado');
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
