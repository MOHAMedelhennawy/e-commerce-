type TModel<TRow> = {
    findMany: () => Promise<TRow[]>;
    findUnique: (args: { where: { id: string } }) => Promise<TRow | null>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
}

export default TModel;