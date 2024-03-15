import {RefinementCtx, z} from "zod";

describe('zod', () => {

    it('should support validation', async () => {
        const schema = z.string().min(3).max(100);

        const request: string = "Iqbal";
        const result = schema.parse(request);
        expect(result).toEqual(request);
    });

    it('should support primitive data type', async () => {

        const usernameSchema = z.string().email();
        const isAdminSchema = z.boolean();
        const priceSchema = z.number().min(1000).max(1000000);

        const username = usernameSchema.parse('iqbal@test.com')
        console.info(username);

        const isAdmin = isAdminSchema.parse(true);
        console.info(isAdmin);

        const price = priceSchema.parse(100000);
        console.info(price);
    });

    it('should support data type conversion', async () => {

        const usernameSchema = z.coerce.string().min(3).max(100);
        const isAdminSchema = z.coerce.boolean();
        const priceSchema = z.coerce.number().min(1000).max(1000000);

        const username = usernameSchema.parse(123)
        console.info(username);

        const isAdmin = isAdminSchema.parse('true');
        console.info(isAdmin);

        const price = priceSchema.parse('100000');
        console.info(price);

    });

    it('should support date validation', async () => {

        const birthDateSchema = z.coerce.date().min(new Date(1990, 0, 1)).max(new Date(2020, 0, 1));

        const birthDate = birthDateSchema.parse('1990-01-01');
        console.info(birthDate);

        const birthDate2 = birthDateSchema.parse(new Date(1990, 0, 1));
        console.info(birthDate2);
    });

    it('should return zod error if invalid', async () => {

        const schema = z.string().email().min(3).max(100);

        try {
            const request: string = "Iqbal";
            const result = schema.parse(request);
        } catch (err) {
            if (err instanceof z.ZodError) {
                err.errors.map(error => {
                    console.info(error.message);
                });
            }
        }
    });

    it('should return zod error if invalid without exception', async () => {

        const schema = z.string().email().min(3).max(100);

        const result = schema.safeParse('iqbal@test.com');

        if (result.success) {
            console.info(result.data);
        } else {
            console.error(result.error);
        }
    });

    it('should can validate object', async () => {

        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6).max(100)
        });

        const request = {
            email: 'iqbal@test.com',
            password: 'password'
        }

        const result = loginSchema.parse(request);
        console.info(result);
    });

    it('should support nested object', async () => {

        const createUserSchema = z.object({
            id: z.string().max(100),
            name: z.string().max(100),
            address: z.object({
                street: z.string().max(100),
                city: z.string().max(100),
                zip: z.string().max(100),
                country: z.string().max(100)
            })
        });

        const request = {
            id: '1',
            name: 'Iqbal',
            address: {
                street: 'Jl. Sana Sini',
                city: 'Jakarta',
                zip: '12345',
                country: 'Indonesia'
            }
        };

        const result = createUserSchema.parse(request);
        console.info(result);
    });

    it('should support array validation', async () => {

        const schema = z.array(z.string().email()).min(1).max(10);

        const request: Array<string> = ['iqbal@test.com', 'pamula@test.com', 'baiq@test.com'];
        const result: Array<string> = schema.parse(request);
        console.info(result);

    });

    it('should support set validation', async () => {

        const schema = z.set(z.string().email()).min(1).max(10);

        const request: Set<string> = new Set(['iqbal@test.com', 'pamula@test.com', 'pamula@test.com']);
        const result: Set<string> = schema.parse(request);

        console.info(result);

    });

    it('should can validate map', async () => {

        const schema = z.map(z.string(), z.string().email());

        const request: Map<string, string> = new Map([
            ['iqbal', 'iqbal@example.com'],
            ['pamula', 'Pamula@example.com'],
        ]);

        const result: Map<string, string> = schema.parse(request);
        console.info(result);

    });

    it('should can validate object with message', async () => {

        const loginSchema = z.object({
            email: z.string().email('Email tidak valid'),
            password: z.string().min(6, 'Password minimal 6 karakter').max(100, 'Password maksimal 100 karakter')
        });

        const request = {
            email: 'iqbal@test.com',
            password: 'password'
        }

        try {
            const result = loginSchema.parse(request);
            console.info(result);
        } catch (err) {
            if (err instanceof z.ZodError) {
                err.errors.map(error => {
                    console.info(error.message);
                });
            }
        }

    });

    it('should support optional validation', async () => {

        const registerSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6).max(20),
            firstName: z.string().min(3).max(100),
            lastName: z.string().min(3).max(100).optional(),
        })

        const request = {
            email: 'iqbal@example.com',
            password: 'password',
            firstName: 'Iqbal',
        }

        try {
            const result = registerSchema.parse(request);
            console.info(result);
        } catch (err) {
            if (err instanceof z.ZodError) {
                err.errors.map(error => {
                    console.info(error.message);
                });
            }
        }
    });

    it('should support transform', async () => {

        const schema = z.string().transform((value) => {
            return value.toUpperCase();
        });

        const result = schema.parse('iqbal');
        console.info(result);

    });

    function mustUpperCase(data: string, ctx: RefinementCtx): string {
        if (data !== data.toUpperCase()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be uppercase'
            });
            return z.NEVER;
        } else {
            return data;
        }
    }

    it('should support custom validation', async () => {

        const loginSchema = z.object({
            email: z.string().email().transform(mustUpperCase),
            password: z.string().min(6).max(20),
        });

        const request = {
            email: 'iqbal@example.com',
            password: 'password',
        }

        const result = loginSchema.parse(request);
        console.info(result);
    });
})