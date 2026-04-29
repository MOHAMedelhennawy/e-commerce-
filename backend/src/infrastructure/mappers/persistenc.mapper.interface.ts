interface IPersistencMapper<TEntity, TRow> {
    toDomain(row: TRow): TEntity;
    toPersistence(entity: TEntity): TRow;
}

export default IPersistencMapper;