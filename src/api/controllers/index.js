function registerControllers(hiddie) {
  hiddie.use('/health', (req, res) => {
    res.json({ status: true });
  });

  hiddie.use('/liveness', (req, res) => {
    res.json({ status: true });
  });
}

export default registerControllers;
