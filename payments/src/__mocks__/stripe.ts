const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 123 }),
  },
};

export default stripe;
