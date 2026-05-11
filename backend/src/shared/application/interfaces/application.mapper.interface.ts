interface IApplicationMapper<TEntity, OutputDTO> {
    toDTO(entity: TEntity): OutputDTO,
}

export default IApplicationMapper;