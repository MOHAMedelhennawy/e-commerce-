interface IApplicationMapper<TEntity, InputDTO, OutputDTO> {
    toDomain(dto: InputDTO): TEntity,
    toDTO(entity: TEntity): OutputDTO,
}

export default IApplicationMapper;