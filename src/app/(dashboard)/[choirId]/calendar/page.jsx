"use client";
import { Fragment, useState, useContext, useEffect } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { ChoirContext } from "../ChoirContext";
import NewCalendarEventModal from "@/components/NewCalendarEventModal";

function NavigationLabel({ label }) {
  return <span className="text-sm font-semibold text-gray-900">{label}</span>;
}

function TileContent({ date, events }) {
  const hasEvent = events.some((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
  return (
    <div className="h-12 w-12 flex items-center justify-center">
      {hasEvent && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i).toISOString().split('T')[0],
      isCurrentMonth: true,
    });
  }

  return days;
}

export default function CalendarPage() {
  const choir = useContext(ChoirContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newCalendarEventModalOpen, setNewCalendarEventModalOpen] = useState(false);
  const [sortedEvents, setSortedEvents] = useState([]);

  useEffect(() => {
    setSortedEvents([...choir.calendar].sort((a, b) => new Date(a.date) - new Date(b.date)));
  }, [choir.calendar]);

  const addEvent = (data) => {
    const event = {
      ...data,
      date: new Date(data.date).toISOString(),
    };
    choir.addCalendarEvent(event);
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear(), selectedDate ? selectedDate.getMonth() - 1 : new Date().getMonth() - 1, 1);
    setSelectedDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear(), selectedDate ? selectedDate.getMonth() + 1 : new Date().getMonth() + 1, 1);
    setSelectedDate(nextMonth);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const filteredEvents = selectedDate
    ? sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : sortedEvents;

  const days = getDaysInMonth(selectedDate || new Date());

  return (
    <div>
      <NewCalendarEventModal
        open={newCalendarEventModalOpen}
        setOpen={setNewCalendarEventModalOpen}
        submit={addEvent}
      />
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Upcoming meetings
      </h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="mt-10 text-center lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:mt-9 xl:col-start-1">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              onClick={handlePreviousMonth}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto text-sm font-semibold">
              {selectedDate ? selectedDate.toLocaleString('default', { month: 'long' }) : new Date().toLocaleString('default', { month: 'long' })} {selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()}
            </div>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              onClick={handleNextMonth}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {days.map((day, dayIdx) => (
              <button
                key={day.date}
                type="button"
                onClick={() => handleDayClick(new Date(day.date))}
                className={classNames(
                  'py-1.5 hover:bg-gray-100 focus:z-10',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  selectedDate && selectedDate.toISOString().split('T')[0] === day.date && 'bg-indigo-100',
                  !selectedDate && day.isCurrentMonth && 'text-gray-900',
                  !selectedDate && !day.isCurrentMonth && 'text-gray-400',
                  selectedDate && day.date === selectedDate.toISOString().split('T')[0] && 'bg-indigo-600 text-white',
                  day.isToday && !selectedDate && 'text-indigo-600',
                  dayIdx === 0 && 'rounded-tl-lg',
                  dayIdx === 6 && 'rounded-tr-lg',
                  dayIdx === days.length - 7 && 'rounded-bl-lg',
                  dayIdx === days.length - 1 && 'rounded-br-lg'
                )}
              >
                <TileContent date={new Date(day.date)} events={choir.calendar} />
                <time
                  dateTime={day.date}
                  className={classNames(
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                    selectedDate && day.date === selectedDate.toISOString().split('T')[0] && 'bg-indigo-600 text-white'
                  )}
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setNewCalendarEventModalOpen(true)}
          >
            Add event
          </button>
        </div>
        <div className="flex flex-col gap-12 lg:col-start-8 lg:col-end-13">
          <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
            {filteredEvents.map((event) => (
              <li
                key={event.eventId}
                className="relative flex space-x-6 py-6 xl:static"
              >
                <div className="flex-auto">
                  <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                    {event.name}
                  </h3>
                  <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                    <div className="flex items-start space-x-3">
                      <dt className="mt-0.5">
                        <span className="sr-only">Date</span>
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </dt>
                      <dd>
                        <time dateTime={event.datetime}>
                          {new Date(event.date).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at {new Date(event.date).toLocaleTimeString()}
                        </time>
                      </dd>
                    </div>
                    <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                      <dt className="mt-0.5">
                        <span className="sr-only">Location</span>
                        <MapPinIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </dt>
                      <dd>{event.location}</dd>
                    </div>
                  </dl>
                  <div className="mt-2 text-gray-500">
                    <p>{event.notes}</p>
                  </div>
                </div>
                <Menu
                  as="div"
                  className="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center"
                >
                  <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                      <span className="sr-only">Open options</span>
                      <EllipsisHorizontalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Edit
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Cancel
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
