interface IUnitOfWork<TTransaction = unknown> {
    transaction(work: (tx: TTransaction) => Promise<void>): Promise<void>
}

export default IUnitOfWork;