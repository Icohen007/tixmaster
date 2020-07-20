import Ticket from '../Ticket';

it('implements optimistic concurrency control', async () => {
  const validParams = { title: 'title', price: 10, userId: 'userId' };
  const ticket = await Ticket.build(validParams);
  await ticket.save();

  const firstFetchedTicket = await Ticket.findById(ticket.id); // version 0
  const secondFetchedTicket = await Ticket.findById(ticket.id); // version 0

  firstFetchedTicket!.set({ price: 15 });
  secondFetchedTicket!.set({ price: 20 });

  await firstFetchedTicket!.save(); // version 1

  await expect(secondFetchedTicket!.save()).rejects.toThrow(); // when save(), search for version 0 in db, can't find it.
});

it('inrements the version number on multiple saves', async () => {
  const validParams = { title: 'title', price: 10, userId: 'userId' };
  const ticket = await Ticket.build(validParams);

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
