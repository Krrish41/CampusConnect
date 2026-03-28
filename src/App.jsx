import { Component, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  PartyPopper,
  PencilLine,
  Plus,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const studentDirectory = {
  s1: 'Alex Student',
  s2: 'Priya Patel',
  s3: 'Jordan Lee',
  s4: 'Sam Rivera',
  s5: 'Maya Chen',
  s6: 'Rohan Gupta',
  s7: 'Nina Park',
};

const adminProfile = { id: 'a1', name: 'Prof. Admin', role: 'Admin' };
const studentProfile = { id: 's1', name: 'Alex Student', role: 'Student' };

const seedEvents = [
  { id: 'e1', title: 'Spring Hackathon 2026', date: '2026-04-02', time: '09:00', venue: 'Innovation Hub', maxCapacity: 120 },
  { id: 'e2', title: 'AI & Ethics Symposium', date: '2026-04-05', time: '11:00', venue: 'Apex Auditorium', maxCapacity: 80 },
  { id: 'e3', title: 'Annual Cultural Fest - Tarang', date: '2026-03-18', time: '16:00', venue: 'Open Air Theatre', maxCapacity: 250 },
  { id: 'e4', title: 'Robotics Workshop', date: '2026-04-09', time: '10:00', venue: 'Lab Complex 3', maxCapacity: 40 },
  { id: 'e5', title: 'Guest Lecture: Future of Web3', date: '2026-04-12', time: '14:00', venue: 'Seminar Hall B', maxCapacity: 90 },
  { id: 'e6', title: 'Campus Placement Drive Prep', date: '2026-03-30', time: '10:30', venue: 'Career Cell Center', maxCapacity: 150 },
  { id: 'e7', title: 'Inter-Department Debate', date: '2026-03-22', time: '15:00', venue: 'Liberal Arts Hall', maxCapacity: 70 },
  { id: 'e8', title: 'Open Source Contribution Sprint', date: '2026-04-15', time: '09:30', venue: 'Code Garage', maxCapacity: 60 },
  { id: 'e9', title: 'Photography Club Exhibition', date: '2026-04-18', time: '17:00', venue: 'Fine Arts Gallery', maxCapacity: 3 },
  { id: 'e10', title: 'Mental Health Awareness Walk', date: '2026-03-29', time: '07:00', venue: 'Campus Green Loop', maxCapacity: 200 },
  { id: 'e11', title: 'E-Sports Tournament', date: '2026-04-20', time: '13:00', venue: 'Digital Arena', maxCapacity: 64 },
];

const seedTickets = [
  { id: 't1', eventId: 'e1', studentId: 's1', status: 'Registered' },
  { id: 't2', eventId: 'e3', studentId: 's1', status: 'Present' },
  { id: 't3', eventId: 'e7', studentId: 's1', status: 'Present' },
  { id: 't4', eventId: 'e6', studentId: 's1', status: 'Registered' },
  { id: 't5', eventId: 'e2', studentId: 's2', status: 'Registered' },
  { id: 't6', eventId: 'e1', studentId: 's3', status: 'Registered' },
  { id: 't7', eventId: 'e3', studentId: 's4', status: 'Present' },
  { id: 't8', eventId: 'e10', studentId: 's5', status: 'Registered' },
  { id: 't9', eventId: 'e4', studentId: 's2', status: 'Registered' },
  { id: 't10', eventId: 'e11', studentId: 's6', status: 'Registered' },
  { id: 't11', eventId: 'e8', studentId: 's3', status: 'Registered' },
  { id: 't12', eventId: 'e7', studentId: 's2', status: 'Present' },
  { id: 't13', eventId: 'e9', studentId: 's2', status: 'Registered' },
  { id: 't14', eventId: 'e9', studentId: 's3', status: 'Registered' },
  { id: 't15', eventId: 'e9', studentId: 's4', status: 'Registered' },
];

const seedCertificates = [
  { id: 'c1', ticketId: 't2', studentName: 'Alex Student', eventTitle: 'Annual Cultural Fest - Tarang', generatedDate: 'March 19, 2026' },
  { id: 'c2', ticketId: 't3', studentName: 'Alex Student', eventTitle: 'Inter-Department Debate', generatedDate: 'March 23, 2026' },
  { id: 'c3', ticketId: 't7', studentName: 'Sam Rivera', eventTitle: 'Annual Cultural Fest - Tarang', generatedDate: 'March 19, 2026' },
  { id: 'c4', ticketId: 't12', studentName: 'Priya Patel', eventTitle: 'Inter-Department Debate', generatedDate: 'March 23, 2026' },
];

const appViews = [
  'landing',
  'login',
  'signup',
  'student-dash',
  'student-history',
  'admin-dash',
  'admin-scanner',
];

const protectedViews = new Set([
  'student-dash',
  'student-history',
  'admin-dash',
  'admin-scanner',
]);

function createEmptyEventForm() {
  return {
    id: null,
    title: '',
    date: '',
    time: '10:00',
    venue: '',
    maxCapacity: '',
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureObjectArray(value) {
  return ensureArray(value).filter(
    (item) => item && typeof item === 'object' && !Array.isArray(item),
  );
}

function ensureObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function toInputString(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return '';
}

function getSafeInputValue(value) {
  if (value && typeof value === 'object' && 'target' in value) {
    return toInputString(value.target?.value);
  }
  return toInputString(value);
}

function preventDefaultSafely(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
}

function getEventTimestamp(date, time) {
  const safeDate = toInputString(date);
  const safeTime = toInputString(time);
  if (!safeDate || !safeTime) return Number.NaN;

  const timestamp = new Date(`${safeDate}T${safeTime}:00`).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NaN;
}

function getSortableTimestamp(date, time) {
  const timestamp = getEventTimestamp(date, time);
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function resolveActiveView(view) {
  return appViews.includes(view) ? view : 'landing';
}

function normalizeLoginForm(form) {
  const safeForm = ensureObject(form);
  return {
    email: toInputString(safeForm.email),
    password: toInputString(safeForm.password),
  };
}

function normalizeSignupForm(form) {
  const safeForm = ensureObject(form);
  const safeRole = safeForm.role === 'Admin' ? 'Admin' : 'Student';
  return {
    name: toInputString(safeForm.name),
    email: toInputString(safeForm.email),
    password: toInputString(safeForm.password),
    role: safeRole,
  };
}

function normalizeEventForm(form) {
  const safeForm = ensureObject(form);
  return {
    id: safeForm.id ?? null,
    title: toInputString(safeForm.title),
    date: toInputString(safeForm.date),
    time: toInputString(safeForm.time) || '10:00',
    venue: toInputString(safeForm.venue),
    maxCapacity: toInputString(safeForm.maxCapacity),
  };
}

function updateSafeObjectField(setter, field, value) {
  setter((current) => ({
    ...ensureObject(current),
    [field]: getSafeInputValue(value),
  }));
}

function hasEventStarted(date, time) {
  const timestamp = getEventTimestamp(date, time);
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function formatDate(date) {
  const safeDate = toInputString(date);
  const parsedDate = safeDate ? new Date(`${safeDate}T00:00:00`) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return 'Date TBD';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatLongDate(date) {
  const safeDate = toInputString(date);
  const parsedDate = safeDate ? new Date(`${safeDate}T00:00:00`) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return 'Date TBD';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeLabel(time) {
  const safeTime = toInputString(time);
  if (!safeTime.includes(':')) {
    return 'Time TBD';
  }

  const [hours, minutes] = safeTime.split(':');
  const normalized = new Date();
  normalized.setHours(Number(hours), Number(minutes), 0, 0);
  return normalized.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStudentName(studentId) {
  return studentDirectory[studentId] || 'Campus Participant';
}

function sortEvents(list) {
  return [...ensureArray(list)].sort(
    (left, right) =>
      getSortableTimestamp(left?.date, left?.time) - getSortableTimestamp(right?.date, right?.time),
  );
}

function validateEmail(value) {
  const safeValue = toInputString(value);
  if (!safeValue.trim()) {
    return 'Email is required';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(safeValue) ? '' : 'Invalid email';
}

function validatePassword(value) {
  const safeValue = toInputString(value);
  if (!safeValue) {
    return 'Password is required';
  }

  return safeValue.length >= 6 ? '' : 'Use at least 6 characters';
}

function validateName(value) {
  const safeValue = toInputString(value);
  if (!safeValue.trim()) {
    return 'Name is required';
  }

  return safeValue.trim().length >= 3 ? '' : 'Name must be at least 3 characters';
}

function validateRole(value) {
  return value ? '' : 'Please select a role';
}

function validateEventField(field, value) {
  const safeValue = toInputString(value);
  if (field === 'title') return safeValue.trim() ? '' : 'Event title is required';
  if (field === 'date') return safeValue ? '' : 'Please select a date';
  if (field === 'time') return safeValue ? '' : 'Please select a time';
  if (field === 'venue') return safeValue.trim() ? '' : 'Venue is required';
  if (field === 'maxCapacity') {
    if (!safeValue) return 'Capacity is required';
    const numericCapacity = Number(safeValue);
    return Number.isInteger(numericCapacity) && numericCapacity > 0
      ? ''
      : 'Capacity must be a positive integer';
  }
  return '';
}

class ViewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown rendering error',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CampusConnect view crashed:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  handleRetry() {
    this.setState({ hasError: false, errorMessage: '' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-shell flex min-h-screen items-center justify-center py-12">
          <div className="glass-panel max-w-xl p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 via-white to-indigo-100 text-rose-500">
              <X className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-slate-800">Something went wrong</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              A view crashed, but CampusConnect stayed alive. You can safely return home or retry
              this screen.
            </p>
            {this.state.errorMessage ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-left text-sm text-rose-500">
                {this.state.errorMessage}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={this.handleRetry} className="ghost-button">
                Retry View
              </button>
              <button
                type="button"
                onClick={this.props.onReturnHome}
                className="primary-button"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [activeView, setActiveView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState(() =>
    sortEvents(
      ensureObjectArray(seedEvents).map((event) => ({
        ...event,
        currentRegistrations: ensureObjectArray(seedTickets).filter(
          (ticket) => ticket?.eventId === event.id,
        ).length,
        isLocked: hasEventStarted(event.date, event.time),
      })),
    ),
  );
  const [tickets, setTickets] = useState(() => ensureObjectArray(seedTickets));
  const [certificates, setCertificates] = useState(() => ensureObjectArray(seedCertificates));
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [guestListEventId, setGuestListEventId] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [scannerBanner, setScannerBanner] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginTouched, setLoginTouched] = useState({});
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [signupTouched, setSignupTouched] = useState({});
  const [eventForm, setEventForm] = useState(() => createEmptyEventForm());
  const [eventTouched, setEventTouched] = useState({});

  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const benefitsRef = useRef(null);

  const safeCurrentUser =
    currentUser && typeof currentUser === 'object' ? currentUser : null;
  const safeUserRole =
    safeCurrentUser?.role === 'Admin' || safeCurrentUser?.role === 'Student'
      ? safeCurrentUser.role
      : null;
  const safeEvents = ensureObjectArray(events);
  const safeTickets = ensureObjectArray(tickets);
  const safeCertificates = ensureObjectArray(certificates);
  const safeLoginForm = normalizeLoginForm(loginForm);
  const safeSignupForm = normalizeSignupForm(signupForm);
  const safeEventForm = normalizeEventForm(eventForm);
  const safeStudentSearch = toInputString(studentSearch);
  const safeAdminSearch = toInputString(adminSearch);
  const safeActiveView = resolveActiveView(activeView);
  const displayView =
    !safeUserRole && protectedViews.has(safeActiveView) ? 'landing' : safeActiveView;

  const loginErrors = {
    email: validateEmail(safeLoginForm.email),
    password: validatePassword(safeLoginForm.password),
  };

  const signupErrors = {
    name: validateName(safeSignupForm.name),
    email: validateEmail(safeSignupForm.email),
    password: validatePassword(safeSignupForm.password),
    role: validateRole(safeSignupForm.role),
  };

  const eventErrors = {
    title: validateEventField('title', safeEventForm.title),
    date: validateEventField('date', safeEventForm.date),
    time: validateEventField('time', safeEventForm.time),
    venue: validateEventField('venue', safeEventForm.venue),
    maxCapacity: validateEventField('maxCapacity', safeEventForm.maxCapacity),
  };

  useEffect(() => {
    if (!toasts.length) return undefined;
    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 2600);
    return () => window.clearTimeout(timeout);
  }, [toasts]);

  function addToast(message, tone = 'success') {
    setToasts((current) => [
      ...current,
      { id: `toast-${Date.now()}-${Math.random()}`, message, tone },
    ]);
  }

  function goToSection(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetAuthForms() {
    setLoginForm({ email: '', password: '' });
    setLoginTouched({});
    setSignupForm({ name: '', email: '', password: '', role: 'Student' });
    setSignupTouched({});
  }

  function navigateTo(view) {
    const nextView = resolveActiveView(view);
    setActiveView(nextView);
    if (nextView !== 'admin-scanner') {
      setScannerBanner(null);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setSelectedEventId(null);
    setGuestListEventId(null);
    setScannerBanner(null);
    resetAuthForms();
    setActiveView('landing');
    addToast('You have been logged out.', 'info');
  }

  function handleLogin(role) {
    setLoginTouched({ email: true, password: true });
    if (loginErrors.email || loginErrors.password) return;
    if (role !== 'Admin' && role !== 'Student') {
      addToast('Please choose a valid role to log in.', 'error');
      return;
    }

    const profile = role === 'Admin' ? adminProfile : studentProfile;
    setCurrentUser(profile);
    setActiveView(role === 'Admin' ? 'admin-dash' : 'student-dash');
    addToast(`Welcome back, ${profile.name}.`);
    resetAuthForms();
  }

  function handleSignupSubmit(event) {
    preventDefaultSafely(event);
    setSignupTouched({ name: true, email: true, password: true, role: true });
    if (signupErrors.name || signupErrors.email || signupErrors.password || signupErrors.role) {
      return;
    }

    const prefix = safeSignupForm.role === 'Admin' ? 'a' : 's';
    const createdUser = {
      id: `${prefix}${Date.now()}`,
      name: safeSignupForm.name.trim(),
      role: safeSignupForm.role,
    };

    setCurrentUser(createdUser);
    setActiveView(safeSignupForm.role === 'Admin' ? 'admin-dash' : 'student-dash');
    addToast(`Account created for ${createdUser.name}.`);
    resetAuthForms();
  }

  function openEditEvent(event) {
    if (!event?.id) {
      addToast('Event details are unavailable right now.', 'error');
      return;
    }

    if (event.isLocked || hasEventStarted(event.date, event.time)) {
      addToast('Locked events cannot be edited.', 'error');
      return;
    }

    setEventForm({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      maxCapacity: String(event.maxCapacity),
    });
    setEventTouched({});
  }

  function resetEventComposer() {
    setEventForm(createEmptyEventForm());
    setEventTouched({});
  }

  function handleEventSubmit(event) {
    preventDefaultSafely(event);
    setEventTouched({ title: true, date: true, time: true, venue: true, maxCapacity: true });
    if (
      eventErrors.title ||
      eventErrors.date ||
      eventErrors.time ||
      eventErrors.venue ||
      eventErrors.maxCapacity
    ) {
      return;
    }

    const capacityValue = Number(safeEventForm.maxCapacity);
    const started = hasEventStarted(safeEventForm.date, safeEventForm.time);

    if (safeEventForm.id) {
      setEvents((current) =>
        sortEvents(
          ensureObjectArray(current).map((item) => {
            if (item?.id !== safeEventForm.id) return item;
            if (item.isLocked || hasEventStarted(item.date, item.time)) return item;
            return {
              ...item,
              title: safeEventForm.title.trim(),
              date: safeEventForm.date,
              time: safeEventForm.time,
              venue: safeEventForm.venue.trim(),
              maxCapacity: capacityValue,
              isLocked: started,
            };
          }),
        ),
      );
      addToast('Event updated successfully.');
    } else {
      const newEvent = {
        id: `e${Date.now()}`,
        title: safeEventForm.title.trim(),
        date: safeEventForm.date,
        time: safeEventForm.time,
        venue: safeEventForm.venue.trim(),
        maxCapacity: capacityValue,
        currentRegistrations: 0,
        isLocked: started,
      };
      setEvents((current) => sortEvents([...ensureObjectArray(current), newEvent]));
      addToast('New event created successfully.');
    }

    resetEventComposer();
  }

  function handleDeleteEvent(eventId) {
    const targetEvent = safeEvents.find((event) => event?.id === eventId);
    if (!targetEvent) return;
    if (targetEvent.isLocked || hasEventStarted(targetEvent.date, targetEvent.time)) {
      addToast('Locked events cannot be deleted.', 'error');
      return;
    }

    const shouldDelete = window.confirm(`Delete "${targetEvent.title}" and all linked tickets?`);
    if (!shouldDelete) return;

    const removedTicketIds = safeTickets
      .filter((ticket) => ticket?.eventId === eventId)
      .map((ticket) => ticket.id);

    setEvents((current) => ensureObjectArray(current).filter((event) => event?.id !== eventId));
    setTickets((current) =>
      ensureObjectArray(current).filter((ticket) => ticket?.eventId !== eventId),
    );
    setCertificates((current) =>
      ensureObjectArray(current).filter(
        (certificate) => !removedTicketIds.includes(certificate?.ticketId),
      ),
    );
    addToast('Event deleted and linked data cleaned up.', 'info');
  }

  function toggleLockEvent(eventId) {
    const targetEvent = safeEvents.find((event) => event?.id === eventId);
    if (!targetEvent) return;
    if (hasEventStarted(targetEvent.date, targetEvent.time)) {
      addToast('Once an event starts, it stays locked.', 'error');
      return;
    }

    setEvents((current) =>
      ensureObjectArray(current).map((event) =>
        event?.id === eventId ? { ...event, isLocked: !event.isLocked } : event,
      ),
    );
    addToast(targetEvent.isLocked ? 'Event unlocked for changes.' : 'Event locked successfully.');
  }

  function handleRegister(event) {
    if (!safeCurrentUser || safeCurrentUser.role !== 'Student' || !event?.id) return;

    const duplicate = safeTickets.some(
      (ticket) => ticket?.eventId === event.id && ticket?.studentId === safeCurrentUser.id,
    );

    if (duplicate) {
      addToast('You are already registered for this event.', 'error');
      return;
    }
    if (event.currentRegistrations >= event.maxCapacity) {
      addToast('This event is already at full capacity.', 'error');
      return;
    }
    if (event.isLocked || hasEventStarted(event.date, event.time)) {
      addToast('Registration is closed for this event.', 'error');
      return;
    }

    const newTicket = {
      id: `t${Date.now()}`,
      eventId: event.id,
      studentId: safeCurrentUser.id,
      status: 'Registered',
    };

    setTickets((current) => [...ensureObjectArray(current), newTicket]);
    setEvents((current) =>
      ensureObjectArray(current).map((item) =>
        item?.id === event.id
          ? { ...item, currentRegistrations: item.currentRegistrations + 1 }
          : item,
      ),
    );
    addToast(`You are in for ${event.title}.`);
  }

  function launchScanner(event) {
    if (!event?.id) {
      addToast('Select a valid event before launching the scanner.', 'error');
      return;
    }

    setSelectedEventId(event.id);
    setScannerBanner(null);
    setEvents((current) =>
      ensureObjectArray(current).map((item) =>
        item?.id === event.id ? { ...item, isLocked: true } : item,
      ),
    );
    setActiveView('admin-scanner');
    addToast(`Scanner launched for ${event.title}.`, 'info');
  }

  function handleSimulatedScan() {
    const pendingTickets = safeTickets.filter(
      (ticket) => ticket?.eventId === selectedEventId && ticket?.status === 'Registered',
    );
    if (!pendingTickets.length) {
      setScannerBanner({
        tone: 'info',
        message: 'No pending registrations left to verify for this event.',
      });
      return;
    }

    const randomTicket = pendingTickets[Math.floor(Math.random() * pendingTickets.length)];
    const studentName = getStudentName(randomTicket.studentId);
    const selectedEvent = safeEvents.find((event) => event?.id === selectedEventId);

    setTickets((current) =>
      ensureObjectArray(current).map((ticket) =>
        ticket?.id === randomTicket.id ? { ...ticket, status: 'Present' } : ticket,
      ),
    );

    setCertificates((current) => {
      const safeCurrentCertificates = ensureObjectArray(current);
      const existingCertificate = safeCurrentCertificates.find(
        (certificate) => certificate?.ticketId === randomTicket.id,
      );
      if (existingCertificate) return current;
      return [
        ...safeCurrentCertificates,
        {
          id: `c${Date.now()}`,
          ticketId: randomTicket.id,
          studentName,
          eventTitle: selectedEvent?.title || 'Campus Event',
          generatedDate: new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
        },
      ];
    });

    setScannerBanner({
      tone: 'success',
      message: `Attendance Marked & Certificate Emailed to ${studentName}!`,
    });
    addToast(`${studentName} verified successfully.`);
  }

  const selectedEvent = safeEvents.find((event) => event?.id === selectedEventId) || null;
  const guestListEvent = safeEvents.find((event) => event?.id === guestListEventId) || null;
  const guestListTickets = guestListEvent
    ? safeTickets.filter((ticket) => ticket?.eventId === guestListEvent.id)
    : [];

  const filteredStudentEvents = safeEvents.filter((event) => {
    const searchSource = `${event.title} ${event.venue}`.toLowerCase();
    const matchesSearch = searchSource.includes(safeStudentSearch.trim().toLowerCase());
    const isFuture = !hasEventStarted(event.date, event.time);
    return matchesSearch && isFuture;
  });

  const adminVisibleEvents = safeEvents.filter((event) =>
    `${event.title} ${event.venue}`.toLowerCase().includes(safeAdminSearch.trim().toLowerCase()),
  );

  const currentUserTickets = safeCurrentUser
    ? safeTickets.filter((ticket) => ticket?.studentId === safeCurrentUser.id)
    : [];

  const activeStudentTickets = currentUserTickets
    .map((ticket) => ({
      ...ticket,
      event: safeEvents.find((event) => event?.id === ticket.eventId),
    }))
    .filter((ticket) => ticket.event && !hasEventStarted(ticket.event.date, ticket.event.time));

  const studentCertificates = safeCertificates.filter((certificate) => {
    const matchingTicket = safeTickets.find((ticket) => ticket?.id === certificate.ticketId);
    return matchingTicket?.studentId === safeCurrentUser?.id;
  });

  const pastParticipation = currentUserTickets
    .map((ticket) => ({
      ...ticket,
      event: safeEvents.find((event) => event?.id === ticket.eventId),
      certificate: safeCertificates.find((certificate) => certificate?.ticketId === ticket.id),
    }))
    .filter((ticket) => ticket.event && hasEventStarted(ticket.event.date, ticket.event.time));

  const totalPresent = safeTickets.filter((ticket) => ticket?.status === 'Present').length;

  const stats = [
    { label: 'Total Events', value: safeEvents.length, icon: Calendar, tint: 'from-indigo-100 to-indigo-50 text-indigo-600' },
    { label: 'Total Registrations', value: safeTickets.length, icon: Users, tint: 'from-emerald-100 to-emerald-50 text-emerald-600' },
    { label: 'Certificates Generated', value: safeCertificates.length, icon: Award, tint: 'from-rose-100 to-rose-50 text-rose-500' },
    { label: 'Attendance Marked', value: totalPresent, icon: BadgeCheck, tint: 'from-amber-100 to-amber-50 text-amber-600' },
  ];

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {toasts.length ? (
          <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${
                  toast.tone === 'error'
                    ? 'border-rose-100 bg-rose-50 text-rose-600 shadow-rose-100'
                    : toast.tone === 'info'
                      ? 'border-indigo-100 bg-indigo-50 text-indigo-600 shadow-indigo-100'
                      : 'border-emerald-100 bg-white text-slate-700 shadow-purple-100'
                }`}
              >
                <p className="text-sm font-semibold">{toast.message}</p>
              </motion.div>
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      <ViewErrorBoundary
        resetKey={`${displayView}-${safeUserRole ?? 'guest'}-${selectedEventId ?? 'none'}`}
        onReturnHome={() => navigateTo('landing')}
      >
        {displayView === 'landing' ? (
        <LandingPage
          onNavigate={navigateTo}
          onLegalNotice={addToast}
          onScrollFeatures={() => goToSection(featuresRef)}
          onScrollHowItWorks={() => goToSection(howItWorksRef)}
          onScrollBenefits={() => goToSection(benefitsRef)}
            featuresRef={featuresRef}
            howItWorksRef={howItWorksRef}
            benefitsRef={benefitsRef}
          />
        ) : null}

        {(displayView === 'login' || displayView === 'signup') && (
          <AuthLayout onHome={() => navigateTo('landing')}>
            {displayView === 'login' ? (
              <LoginView
                form={safeLoginForm}
                touched={loginTouched}
                errors={loginErrors}
                onChange={(field, value) => updateSafeObjectField(setLoginForm, field, value)}
                onTouch={(field) => setLoginTouched((current) => ({ ...current, [field]: true }))}
                onLogin={handleLogin}
                onSwitch={() => navigateTo('signup')}
              />
            ) : (
              <SignupView
                form={safeSignupForm}
                touched={signupTouched}
                errors={signupErrors}
                onChange={(field, value) => updateSafeObjectField(setSignupForm, field, value)}
                onTouch={(field) =>
                  setSignupTouched((current) => ({ ...current, [field]: true }))
                }
                onSubmit={handleSignupSubmit}
                onSwitch={() => navigateTo('login')}
              />
            )}
          </AuthLayout>
        )}

        {safeCurrentUser &&
        displayView !== 'landing' &&
        displayView !== 'login' &&
        displayView !== 'signup' ? (
          <div className="relative overflow-hidden">
            <div className="hero-orb left-4 top-10 h-56 w-56 bg-indigo-200/60" />
            <div className="hero-orb right-10 top-20 h-64 w-64 bg-emerald-200/40" />

            <div className="section-shell py-6">
              <AuthenticatedHeader
                currentUser={safeCurrentUser}
                activeView={displayView}
                onNavigate={navigateTo}
                onLogout={handleLogout}
                selectedEvent={selectedEvent}
              />

              <AnimatePresence mode="wait">
                {safeUserRole === 'Student' && displayView === 'student-dash' ? (
                  <motion.div
                    key="student-dash"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <StudentDashboard
                      events={filteredStudentEvents}
                      currentUser={safeCurrentUser}
                      tickets={safeTickets}
                      studentSearch={safeStudentSearch}
                      onSearch={(value) => setStudentSearch(getSafeInputValue(value))}
                      onRegister={handleRegister}
                    />
                  </motion.div>
                ) : null}

                {safeUserRole === 'Student' && displayView === 'student-history' ? (
                  <motion.div
                    key="student-history"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <StudentHistory
                      activeTickets={activeStudentTickets}
                      pastParticipation={pastParticipation}
                      studentCertificates={studentCertificates}
                      currentUser={safeCurrentUser}
                    />
                  </motion.div>
                ) : null}

                {safeUserRole === 'Admin' && displayView === 'admin-dash' ? (
                  <motion.div
                    key="admin-dash"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <AdminDashboard
                      stats={stats}
                      eventForm={safeEventForm}
                      eventTouched={eventTouched}
                      eventErrors={eventErrors}
                      onEventChange={(field, value) =>
                        updateSafeObjectField(setEventForm, field, value)
                      }
                      onEventTouch={(field) =>
                        setEventTouched((current) => ({ ...current, [field]: true }))
                      }
                      onSubmit={handleEventSubmit}
                      onReset={resetEventComposer}
                      events={adminVisibleEvents}
                      adminSearch={safeAdminSearch}
                      onSearch={(value) => setAdminSearch(getSafeInputValue(value))}
                      onGuestList={setGuestListEventId}
                      onToggleLock={toggleLockEvent}
                      onScanner={launchScanner}
                      onDelete={handleDeleteEvent}
                      onEdit={openEditEvent}
                    />
                  </motion.div>
                ) : null}

                {safeUserRole === 'Admin' && displayView === 'admin-scanner' ? (
                  <motion.div
                    key="admin-scanner"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AdminScanner
                      event={selectedEvent}
                      tickets={safeTickets.filter(
                        (ticket) => ticket?.eventId === selectedEventId,
                      )}
                      banner={scannerBanner}
                      onSimulate={handleSimulatedScan}
                      onBack={() => navigateTo('admin-dash')}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
      </ViewErrorBoundary>

      <AnimatePresence>
        {guestListEvent ? (
          <GuestListModal
            event={guestListEvent}
            tickets={guestListTickets}
            onClose={() => setGuestListEventId(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LandingPage({
  onNavigate,
  onLegalNotice,
  onScrollFeatures,
  onScrollHowItWorks,
  onScrollBenefits,
  featuresRef,
  howItWorksRef,
  benefitsRef,
}) {
  const features = [
    {
      title: 'Frictionless Registration',
      description: 'Browse events and secure a seat with one click. No more Google Forms.',
      icon: Calendar,
      tint: 'from-indigo-50 to-white text-indigo-500',
    },
    {
      title: 'Instant QR Attendance',
      description: 'Eliminate proxy attendance. Organizers scan digital tickets at the door.',
      icon: QrCode,
      tint: 'from-emerald-50 to-white text-emerald-500',
    },
    {
      title: 'Automated Certificates',
      description:
        'Verifiable PDF certificates are generated and delivered the second an event ends.',
      icon: Award,
      tint: 'from-rose-50 to-white text-rose-400',
    },
  ];

  const steps = [
    {
      title: 'Create & Discover',
      description:
        'Admins publish events while students discover them from a single polished dashboard.',
    },
    {
      title: 'Scan & Verify',
      description:
        'Students arrive with mobile QR passes and organizers verify attendance in seconds.',
    },
    {
      title: 'Automate & Reward',
      description:
        'Present participants get instantly generated certificates ready for their portfolio.',
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Trustworthy participation records',
      description:
        'Attendance, verification, and certificate generation all stay in sync with one source of truth.',
    },
    {
      icon: Sparkles,
      title: 'Delightful student experience',
      description:
        'Students move from signup to event registration to certificate showcase without friction.',
    },
    {
      icon: PartyPopper,
      title: 'Less admin busywork',
      description:
        'No more spreadsheets, manual email follow-ups, or certificate formatting at midnight.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="hero-orb -left-12 top-16 h-72 w-72 bg-indigo-200/60" />
      <div className="hero-orb right-0 top-0 h-96 w-96 bg-purple-200/45" />
      <div className="hero-orb bottom-20 left-1/3 h-80 w-80 bg-emerald-200/45" />

      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-4 py-4">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-lg font-extrabold text-indigo-600"
          >
            <GraduationCap className="h-6 w-6" />
            CampusConnect
          </button>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <button
              type="button"
              onClick={onScrollFeatures}
              className="transition hover:text-indigo-500"
            >
              Features
            </button>
            <button
              type="button"
              onClick={onScrollHowItWorks}
              className="transition hover:text-indigo-500"
            >
              How it Works
            </button>
            <button
              type="button"
              onClick={onScrollBenefits}
              className="transition hover:text-indigo-500"
            >
              Benefits
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onNavigate('login')} className="ghost-button">
              Log In
            </button>
            <button type="button" onClick={() => onNavigate('signup')} className="primary-button">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="section-shell grid min-h-[calc(100vh-90px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-600 shadow-lg shadow-purple-100">
              <Sparkles className="h-4 w-4 text-amber-500" />
              A smarter college event experience
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-extrabold leading-tight text-slate-800 sm:text-6xl">
                Transform the Way Your Campus{' '}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Connects
                </span>
                .
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-500">
                Say goodbye to paper attendance and manual certificates. Automate your college
                events, verify participation instantly, and build a digital portfolio.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-400 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:bg-indigo-500"
              >
                Get Started for Free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onScrollFeatures}
                className="ghost-button !px-6 !py-4"
              >
                Explore Features
              </button>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ['One-click registrations', 'Student-first flow'],
                ['Live attendance sync', 'Admin confidence'],
                ['Auto certificates', 'Zero manual chase'],
              ].map(([title, subtitle]) => (
                <div key={title} className="glass-panel px-5 py-4">
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-emerald-200/60 blur-2xl" />
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-rose-200/60 blur-2xl" />
            <div className="glass-panel relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-grid bg-[size:24px_24px]" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Live Experience
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-slate-800">
                      Student + Admin in one flow
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[24px] bg-gradient-to-br from-white to-indigo-50 p-4 shadow-lg shadow-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="muted-badge bg-emerald-100 text-emerald-600">QR Ticket</span>
                      <QrCode className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="mt-6 grid h-28 place-items-center rounded-2xl border border-dashed border-indigo-200 bg-white">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-3 w-3 rounded-sm ${
                              index % 2 === 0 || index % 7 === 0
                                ? 'bg-slate-700'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Open Source Contribution Sprint
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Seat confirmed. Scan on arrival.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] bg-gradient-to-br from-white to-emerald-50 p-5 shadow-lg shadow-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                          <ScanLine className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Attendance automation
                          </p>
                          <p className="text-sm text-slate-500">
                            Mark present and trigger certificate email
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border-[10px] border-indigo-100 bg-white p-5 shadow-lg shadow-purple-100">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                          Certificate Preview
                        </p>
                        <p className="mt-3 text-3xl font-serif text-slate-800">Alex Student</p>
                        <p className="mt-2 text-sm text-slate-500">
                          for outstanding participation in the AI &amp; Ethics Symposium
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-3 text-indigo-500">
                          <Award className="h-5 w-5" />
                          <span className="text-sm font-semibold">Verified instantly</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section ref={featuresRef} className="section-shell py-20">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to manage events perfectly."
            subtitle="From discovery to attendance to proof of participation, CampusConnect keeps every touchpoint intuitive and in sync."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${feature.tint} p-7 shadow-lg shadow-purple-100`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-purple-100">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-800">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section ref={howItWorksRef} className="bg-white/55 py-20">
          <div className="section-shell">
            <SectionHeader
              eyebrow="How It Works"
              title="Effortless for Students, Powerful for Admins."
              subtitle="A connected workflow that removes repetitive admin steps while keeping students informed and excited."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-[30px] bg-white p-7 shadow-lg shadow-purple-100"
                >
                  <div className="absolute left-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-extrabold text-indigo-600">
                    {index + 1}
                  </div>
                  <div className="pl-16">
                    <h3 className="text-xl font-extrabold text-slate-800">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 ? (
                    <ChevronRight className="mt-8 hidden h-8 w-8 text-indigo-200 lg:block" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={benefitsRef} className="section-shell py-20">
          <SectionHeader
            eyebrow="Benefits"
            title="Ready for high-volume campus activity without losing the human touch."
            subtitle="CampusConnect combines polished student UX with operational reliability so every event feels organized and memorable."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="soft-card p-7"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-emerald-100 text-indigo-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-800">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-shell pb-12">
          <div className="rounded-[36px] bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-300 px-8 py-12 text-center text-white shadow-glow sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
              Final CTA
            </p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Ready to modernize your college events?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90">
              Launch registrations, attendance automation, and certificate delivery from one
              beautifully simple portal.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-600 transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
            >
              Join CampusConnect Today
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 bg-white/55">
        <div className="section-shell flex flex-col gap-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="text-center font-medium text-slate-600 md:text-left">
            Developed by Krrish Ranjan | 28 May 2026
          </p>
          <div className="flex items-center justify-center gap-6 md:justify-end">
            <button
              type="button"
              onClick={() => onLegalNotice?.('Privacy Policy - Coming Soon!', 'info')}
              className="transition hover:text-indigo-500"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onLegalNotice?.('Terms of Service - Coming Soon!', 'info')}
              className="transition hover:text-indigo-500"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthLayout({ children, onHome }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="hero-orb -left-16 top-20 h-72 w-72 bg-indigo-200/50" />
      <div className="hero-orb right-10 top-24 h-64 w-64 bg-purple-200/50" />
      <div className="hero-orb bottom-16 left-1/3 h-72 w-72 bg-emerald-200/45" />

      <button
        type="button"
        onClick={onHome}
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-600 backdrop-blur-xl transition hover:bg-white"
      >
        <GraduationCap className="h-4 w-4 text-indigo-600" />
        CampusConnect
      </button>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function LoginView({ form, touched, errors, onChange, onTouch, onLogin, onSwitch }) {
  const safeForm = normalizeLoginForm(form);
  const safeTouched = ensureObject(touched);
  const safeErrors = ensureObject(errors);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 sm:p-10"
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-emerald-100 text-indigo-600">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-800">Welcome back</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Sign in to your portal and continue managing registrations, attendance, and
          certificates.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <AuthField
          label="Email"
          type="email"
          placeholder="alex@campus.edu"
          value={safeForm.email}
          onChange={(value) => onChange('email', value)}
          onBlur={() => onTouch('email')}
          error={safeTouched.email ? toInputString(safeErrors.email) : ''}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={safeForm.password}
          onChange={(value) => onChange('password', value)}
          onBlur={() => onTouch('password')}
          error={safeTouched.password ? toInputString(safeErrors.password) : ''}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => onLogin('Student')} className="primary-button">
          Login as Student
        </button>
        <button
          type="button"
          onClick={() => onLogin('Admin')}
          className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-400 active:translate-y-0"
        >
          Login as Admin
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-indigo-500 transition hover:text-indigo-600"
        >
          Create an account
        </button>
      </p>
    </motion.div>
  );
}

function SignupView({ form, touched, errors, onChange, onTouch, onSubmit, onSwitch }) {
  const safeForm = normalizeSignupForm(form);
  const safeTouched = ensureObject(touched);
  const safeErrors = ensureObject(errors);

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="glass-panel p-8 sm:p-10"
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 via-white to-indigo-100 text-indigo-600">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-800">Create your account</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Join as a student or admin and start exploring CampusConnect instantly.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <AuthField
          label="Name"
          type="text"
          placeholder="Alex Student"
          value={safeForm.name}
          onChange={(value) => onChange('name', value)}
          onBlur={() => onTouch('name')}
          error={safeTouched.name ? toInputString(safeErrors.name) : ''}
        />
        <AuthField
          label="Email"
          type="email"
          placeholder="you@campus.edu"
          value={safeForm.email}
          onChange={(value) => onChange('email', value)}
          onBlur={() => onTouch('email')}
          error={safeTouched.email ? toInputString(safeErrors.email) : ''}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Choose a password"
          value={safeForm.password}
          onChange={(value) => onChange('password', value)}
          onBlur={() => onTouch('password')}
          error={safeTouched.password ? toInputString(safeErrors.password) : ''}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
          <div className="grid grid-cols-2 gap-3">
            {['Student', 'Admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange('role', role);
                  onTouch('role');
                }}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  safeForm.role === role
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-indigo-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          {safeTouched.role && safeErrors.role ? (
            <p className="mt-2 text-sm text-rose-500">{toInputString(safeErrors.role)}</p>
          ) : null}
        </div>
      </div>

      <button type="submit" className="primary-button mt-8 w-full">
        Sign Up
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-indigo-500 transition hover:text-indigo-600"
        >
          Sign in
        </button>
      </p>
    </motion.form>
  );
}

function AuthField({ label, error, ...props }) {
  const safeValue = getSafeInputValue(props.value);
  const { onChange, ...restProps } = props;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <input
        {...restProps}
        value={safeValue}
        onChange={(event) => onChange?.(getSafeInputValue(event))}
        className="field-input"
      />
      {error ? <p className="mt-2 text-sm text-rose-500">{toInputString(error)}</p> : null}
    </div>
  );
}

function AuthenticatedHeader({ currentUser, activeView, onNavigate, onLogout, selectedEvent }) {
  const safeCurrentUser = currentUser && typeof currentUser === 'object' ? currentUser : {};
  const safeActiveView = resolveActiveView(activeView);
  const isStudent = safeCurrentUser.role === 'Student';
  const navItems = isStudent
    ? [
        { label: 'Upcoming Events', view: 'student-dash' },
        { label: 'History & Certificates', view: 'student-history' },
      ]
    : [
        { label: 'Admin Dashboard', view: 'admin-dash' },
        {
          label: selectedEvent ? `Scanner: ${selectedEvent.title}` : 'Scanner',
          view: 'admin-scanner',
        },
      ];

  return (
    <div className="glass-panel mb-8 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-emerald-100 text-indigo-600">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-extrabold text-slate-800">CampusConnect</p>
          <p className="text-sm text-slate-500">
            Event Participation &amp; Certificate Automation Portal
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:items-end">
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const disabled = item.view === 'admin-scanner' && !selectedEvent;
            return (
              <button
                key={item.view}
                type="button"
                disabled={disabled}
                onClick={() => onNavigate(item.view)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  safeActiveView === item.view
                    ? 'bg-indigo-400 text-white shadow-lg shadow-indigo-200'
                    : disabled
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-slate-700">{toInputString(safeCurrentUser.name)}</span>
          <span
            className={`muted-badge ${
              isStudent
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {toInputString(safeCurrentUser.role) || 'User'}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:text-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ events, currentUser, tickets, studentSearch, onSearch, onRegister }) {
  const safeEvents = ensureObjectArray(events);
  const safeTickets = ensureObjectArray(tickets);
  const safeCurrentUser = currentUser && typeof currentUser === 'object' ? currentUser : {};
  const safeSearch = toInputString(studentSearch);

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Student Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-800">Upcoming Events</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Browse what&apos;s happening next, secure your seat instantly, and keep your digital
            event portfolio growing.
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-purple-100">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={safeSearch}
              onChange={(event) => onSearch(getSafeInputValue(event))}
              placeholder="Search by event title or venue"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid gap-4">
          <SummaryCard
            title="Your Tickets"
            value={safeTickets.filter((ticket) => ticket?.studentId === safeCurrentUser.id).length}
            subtitle="Registrations synced in real time"
            icon={Ticket}
            tone="indigo"
          />
          <SummaryCard
            title="Certificates Unlocked"
            value={
              safeTickets.filter(
                (ticket) =>
                  ticket?.studentId === safeCurrentUser.id && ticket?.status === 'Present',
              ).length
            }
            subtitle="Available in your history panel"
            icon={Award}
            tone="emerald"
          />
        </div>
      </section>

      {safeEvents.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {safeEvents.map((event, index) => {
            const duplicate = safeTickets.some(
              (ticket) => ticket?.eventId === event.id && ticket?.studentId === safeCurrentUser.id,
            );
            const full = event.currentRegistrations >= event.maxCapacity;
            const locked = event.isLocked || hasEventStarted(event.date, event.time);
            let buttonLabel = 'Register';
            let disabled = false;

            if (duplicate) {
              buttonLabel = 'Registered';
              disabled = true;
            } else if (full) {
              buttonLabel = 'House Full';
              disabled = true;
            } else if (locked) {
              buttonLabel = 'Registration Closed';
              disabled = true;
            }

            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="soft-card overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-emerald-100 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">{event.title}</h2>
                      <p className="mt-2 text-sm text-slate-500">{event.venue}</p>
                    </div>
                    <span
                      className={`muted-badge ${
                        full
                          ? 'bg-rose-100 text-rose-500'
                          : duplicate
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {full
                        ? 'Full'
                        : duplicate
                          ? 'Booked'
                          : `${event.maxCapacity - event.currentRegistrations} seats left`}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <InfoRow icon={Calendar} label={formatDate(event.date)} />
                  <InfoRow icon={Clock3} label={formatTimeLabel(event.time)} />
                  <InfoRow icon={MapPin} label={event.venue} />

                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Capacity</span>
                      <span className="font-semibold text-slate-700">
                        {event.currentRegistrations}/{event.maxCapacity}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (event.currentRegistrations / event.maxCapacity) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRegister(event)}
                    className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
                      disabled
                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                        : 'bg-indigo-400 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-500'
                    }`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={Search}
          title="No events found"
          description="Try a different keyword or clear the filter to see more upcoming campus events."
        />
      )}
    </>
  );
}

function StudentHistory({ activeTickets, pastParticipation, studentCertificates, currentUser }) {
  const safeActiveTickets = ensureObjectArray(activeTickets);
  const safePastParticipation = ensureObjectArray(pastParticipation);
  const safeStudentCertificates = ensureObjectArray(studentCertificates);
  const safeCurrentUser = currentUser && typeof currentUser === 'object' ? currentUser : {};

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Student History
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-800">Tickets & Certificates</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Track upcoming registrations, revisit your attended events, and showcase your verified
            certificates in one place.
          </p>
        </div>

        <div className="grid gap-4">
          <SummaryCard
            title="Upcoming Tickets"
            value={safeActiveTickets.length}
            subtitle="Ready for QR-based check-in"
            icon={QrCode}
            tone="indigo"
          />
          <SummaryCard
            title="Verified Attendance"
            value={safePastParticipation.filter((ticket) => ticket?.status === 'Present').length}
            subtitle="Required for certificate generation"
            icon={CheckCircle2}
            tone="emerald"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Active Tickets</h2>
              <p className="text-sm text-slate-500">Your upcoming confirmed events</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {safeActiveTickets.length ? (
              safeActiveTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{ticket.event.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{ticket.event.venue}</p>
                    </div>
                    <span className="muted-badge bg-indigo-100 text-indigo-600">
                      {ticket.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>{formatDate(ticket.event.date)}</span>
                    <span>{formatTimeLabel(ticket.event.time)}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm shadow-purple-100">
                    <QrCode className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-600">
                      Dummy QR pass ready for scan
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Ticket}
                title="No active tickets yet"
                description="Register for an upcoming event to see your QR-enabled pass appear here."
                compact
              />
            )}
          </div>
        </div>

        <div className="soft-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">
                Past Events & Certificates
              </h2>
              <p className="text-sm text-slate-500">
                Certificates unlock only after attendance is marked Present
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {safePastParticipation.length ? (
              <>
                <div className="grid gap-4">
                  {safePastParticipation.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{ticket.event.title}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatLongDate(ticket.event.date)}
                          </p>
                        </div>
                        <span
                          className={`muted-badge ${
                            ticket.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">
                        {ticket.status === 'Present'
                          ? 'Attendance verified. Certificate generated below.'
                          : 'Certificate pending until attendance is marked Present.'}
                      </p>
                    </div>
                  ))}
                </div>

                {safeStudentCertificates.length ? (
                  <div className="grid gap-5">
                    {safeStudentCertificates.map((certificate) => (
                      <CertificateCard
                        key={certificate.id}
                        certificate={certificate}
                        studentName={safeCurrentUser.name}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                icon={Award}
                title="No past participation yet"
                description="Attend an event and get marked Present to unlock your first certificate."
                compact
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminDashboard({
  stats,
  eventForm,
  eventTouched,
  eventErrors,
  onEventChange,
  onEventTouch,
  onSubmit,
  onReset,
  events,
  adminSearch,
  onSearch,
  onGuestList,
  onToggleLock,
  onScanner,
  onDelete,
  onEdit,
}) {
  const safeStats = ensureObjectArray(stats);
  const safeEvents = ensureObjectArray(events);
  const safeEventForm = normalizeEventForm(eventForm);
  const safeEventTouched = ensureObject(eventTouched);
  const safeEventErrors = ensureObject(eventErrors);
  const safeAdminSearch = toInputString(adminSearch);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {safeStats.map((stat) => (
          <SummaryCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            subtitle="Live from the shared mock database"
            icon={stat.icon}
            tone={stat.tint}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={onSubmit} className="glass-panel p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
                Admin Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
                {safeEventForm.id ? 'Edit Event' : 'Create Event'}
              </h1>
            </div>
            {safeEventForm.id ? (
              <button type="button" onClick={onReset} className="ghost-button !px-4 !py-2">
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Title"
              value={safeEventForm.title}
              onChange={(value) => onEventChange('title', value)}
              onBlur={() => onEventTouch('title')}
              error={safeEventTouched.title ? safeEventErrors.title : ''}
              placeholder="Campus Innovation Day"
            />
            <FormField
              label="Venue"
              value={safeEventForm.venue}
              onChange={(value) => onEventChange('venue', value)}
              onBlur={() => onEventTouch('venue')}
              error={safeEventTouched.venue ? safeEventErrors.venue : ''}
              placeholder="Main Auditorium"
            />
            <FormField
              label="Date"
              type="date"
              value={safeEventForm.date}
              onChange={(value) => onEventChange('date', value)}
              onBlur={() => onEventTouch('date')}
              error={safeEventTouched.date ? safeEventErrors.date : ''}
            />
            <FormField
              label="Time"
              type="time"
              value={safeEventForm.time}
              onChange={(value) => onEventChange('time', value)}
              onBlur={() => onEventTouch('time')}
              error={safeEventTouched.time ? safeEventErrors.time : ''}
            />
            <div className="sm:col-span-2">
              <FormField
                label="Capacity"
                type="number"
                value={safeEventForm.maxCapacity}
                onChange={(value) => onEventChange('maxCapacity', value)}
                onBlur={() => onEventTouch('maxCapacity')}
                error={safeEventTouched.maxCapacity ? safeEventErrors.maxCapacity : ''}
                placeholder="120"
              />
            </div>
          </div>

          <button type="submit" className="primary-button mt-7">
            <Plus className="mr-2 h-4 w-4" />
            {safeEventForm.id ? 'Update Event' : 'Create Event'}
          </button>
        </form>

        <div className="soft-card p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Event List</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage registrations, lock status, guest lists, and attendance.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-slate-50 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={safeAdminSearch}
                onChange={(event) => onSearch(getSafeInputValue(event))}
                placeholder="Search events"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold">Capacity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {safeEvents.length ? (
                    safeEvents.map((event) => {
                      const lockedForever = hasEventStarted(event.date, event.time);
                      const actionsLocked = event.isLocked || lockedForever;
                      return (
                        <tr key={event.id} className="align-top">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-800">{event.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{event.venue}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-500">
                            <p>{formatDate(event.date)}</p>
                            <p className="mt-1 text-xs">{formatTimeLabel(event.time)}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-500">
                            {event.currentRegistrations}/{event.maxCapacity}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`muted-badge ${
                                actionsLocked
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-600'
                              }`}
                            >
                              {actionsLocked ? 'Locked' : 'Open'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <ActionButton
                                onClick={() => onGuestList(event.id)}
                                icon={Eye}
                                label="Guest List"
                              />
                              <ActionButton
                                onClick={() => onToggleLock(event.id)}
                                icon={Lock}
                                label={event.isLocked ? 'Unlock' : 'Lock'}
                                disabled={lockedForever}
                              />
                              <ActionButton
                                onClick={() => onEdit(event)}
                                icon={PencilLine}
                                label="Edit"
                                disabled={actionsLocked}
                              />
                              <ActionButton
                                onClick={() => onScanner(event)}
                                icon={Camera}
                                label="Scanner"
                              />
                              <ActionButton
                                onClick={() => onDelete(event.id)}
                                icon={Trash2}
                                label="Delete"
                                disabled={actionsLocked}
                                danger
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-10">
                        <EmptyState
                          icon={Search}
                          title="No admin results"
                          description="Try a different search term to find the event you want to manage."
                          compact
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminScanner({ event, tickets, banner, onSimulate, onBack }) {
  const safeTickets = ensureObjectArray(tickets);
  const safeEvent = ensureObject(event);
  const pendingCount = safeTickets.filter((ticket) => ticket?.status === 'Registered').length;
  const presentCount = safeTickets.filter((ticket) => ticket?.status === 'Present').length;

  return (
    <div className="section-shell max-w-3xl px-0">
      <div className="glass-panel overflow-hidden p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
              Admin Scanner
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {event ? toInputString(safeEvent.title) : 'Select an Event'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Mobile-first attendance capture with automatic certificate generation.
            </p>
          </div>
          <button type="button" onClick={onBack} className="ghost-button">
            Back to Dashboard
          </button>
        </div>

        {event ? (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
              <div className="rounded-[32px] border border-slate-100 bg-slate-900 p-5 text-white shadow-lg shadow-slate-300">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                    Camera View
                  </span>
                  <ScanLine className="h-5 w-5 text-white/80" />
                </div>
                <div className="mt-6 aspect-[9/16] rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 p-5">
                  <div className="flex h-full flex-col justify-between rounded-[22px] border-2 border-dashed border-emerald-300/70 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.14),_transparent_40%),linear-gradient(to_bottom_right,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/70">
                      <span>Align QR within frame</span>
                      <span>{pendingCount} pending</span>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-6">
                      <div className="grid place-items-center rounded-[22px] border border-emerald-300/60 py-12">
                        <div className="grid grid-cols-5 gap-2">
                          {Array.from({ length: 25 }).map((_, index) => (
                            <span
                              key={index}
                              className={`h-4 w-4 rounded-sm ${
                                index % 2 === 0 || index % 5 === 0
                                  ? 'bg-emerald-300'
                                  : 'bg-white/15'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-white/75">
                      Tap simulate to mark a random registered attendee as present.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="soft-card p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Scanner Stats
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <ScannerMetric label="Registered" value={safeTickets.length} />
                    <ScannerMetric label="Present" value={presentCount} />
                    <ScannerMetric label="Pending" value={pendingCount} />
                    <ScannerMetric label="Locked" value="Yes" />
                  </div>
                </div>

                <button type="button" onClick={onSimulate} className="w-full primary-button !py-4">
                  <ScanLine className="mr-2 h-4 w-4" />
                  Simulate QR Scan
                </button>

                {banner ? (
                  <div
                    className={`rounded-2xl px-4 py-4 text-sm font-semibold ${
                      banner.tone === 'success'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {banner.message}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/80 px-4 py-4 text-sm text-slate-500">
                    Certificates will only be generated for attendees whose status becomes{' '}
                    <span className="font-semibold text-slate-700">Present</span>.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">
                    Live Attendance Queue
                  </h2>
                  <p className="text-sm text-slate-500">
                    Watch registrations move to Present in real time.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {safeTickets.length ? (
                  safeTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {getStudentName(ticket.studentId)}
                        </p>
                        <p className="text-sm text-slate-500">Ticket #{ticket.id}</p>
                      </div>
                      <span
                        className={`muted-badge ${
                          ticket.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={Users}
                    title="No registrations yet"
                    description="Once students register, they will appear here for scanner verification."
                    compact
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Camera}
            title="No event selected"
            description="Launch the scanner from the admin dashboard to begin attendance capture."
          />
        )}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-500">
        {toInputString(eyebrow)}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold text-slate-800 sm:text-4xl">
        {toInputString(title)}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
        {toInputString(subtitle)}
      </p>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, tone }) {
  const ResolvedIcon = Icon || Sparkles;
  const toneClasses =
    tone === 'emerald'
      ? 'from-emerald-100 to-white text-emerald-600'
      : tone === 'indigo'
        ? 'from-indigo-100 to-white text-indigo-600'
        : tone === 'rose'
          ? 'from-rose-100 to-white text-rose-500'
          : typeof tone === 'string'
            ? tone
            : 'from-indigo-100 to-white text-indigo-600';

  return (
    <div className="soft-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{toInputString(title)}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-800">{toInputString(value)}</p>
          <p className="mt-2 text-sm text-slate-500">{toInputString(subtitle)}</p>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses}`}
        >
          <ResolvedIcon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label }) {
  const ResolvedIcon = Icon || Sparkles;
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
        <ResolvedIcon className="h-4 w-4" />
      </div>
      <span>{toInputString(label)}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, compact = false }) {
  const ResolvedIcon = Icon || Sparkles;
  return (
    <div
      className={`grid place-items-center rounded-3xl border border-dashed border-slate-200 bg-white/80 text-center ${
        compact ? 'px-4 py-8' : 'px-6 py-14'
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-emerald-100 text-indigo-600">
        <ResolvedIcon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-slate-800">{toInputString(title)}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
        {toInputString(description)}
      </p>
    </div>
  );
}

function FormField({ label, error, type = 'text', value, onChange, onBlur, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {toInputString(label)}
      </label>
      <input
        type={type}
        value={getSafeInputValue(value)}
        placeholder={toInputString(placeholder)}
        onChange={(event) => onChange?.(getSafeInputValue(event))}
        onBlur={onBlur}
        className="field-input"
      />
      {error ? <p className="mt-2 text-sm text-rose-500">{toInputString(error)}</p> : null}
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled = false, danger = false }) {
  const ResolvedIcon = Icon || Sparkles;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
        disabled
          ? 'cursor-not-allowed bg-slate-100 text-slate-400'
          : danger
            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      <ResolvedIcon className="h-3.5 w-3.5" />
      {toInputString(label)}
    </button>
  );
}

function ScannerMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {toInputString(label)}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-slate-800">{toInputString(value)}</p>
    </div>
  );
}

function GuestListModal({ event, tickets, onClose }) {
  const safeEvent = ensureObject(event);
  const safeTickets = ensureObjectArray(tickets);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="glass-panel w-full max-w-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
              Guest List
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-800">
              {toInputString(safeEvent.title)}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {formatDate(safeEvent.date)} at {formatTimeLabel(safeEvent.time)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/80 p-2 text-slate-500 transition hover:bg-white hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {safeTickets.length ? (
            safeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-4 shadow-sm shadow-purple-100"
              >
                <div>
                  <p className="font-semibold text-slate-800">{getStudentName(ticket.studentId)}</p>
                  <p className="mt-1 text-sm text-slate-500">Student ID: {ticket.studentId}</p>
                </div>
                <span
                  className={`muted-badge ${
                    ticket.status === 'Present'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Users}
              title="Guest list is empty"
              description="Registrations will show up here as soon as students start booking seats."
              compact
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CertificateCard({ certificate, studentName }) {
  const safeCertificate = ensureObject(certificate);
  return (
    <div className="rounded-[32px] border-[10px] border-indigo-100 bg-gradient-to-br from-white via-rose-50 to-emerald-50 p-7 shadow-lg shadow-purple-100">
      <div className="rounded-[24px] border border-dashed border-indigo-200 bg-white/85 px-6 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Certificate of Participation
        </p>
        <p className="mt-6 text-sm text-slate-500">This certifies that</p>
        <h3 className="mt-2 text-5xl font-serif font-bold text-slate-800">
          {toInputString(studentName)}
        </h3>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
          successfully participated in{' '}
          <span className="font-semibold text-indigo-600">
            {toInputString(safeCertificate.eventTitle)}
          </span>{' '}
          and
          fulfilled the attendance requirement for verified participation.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row">
          <span className="rounded-full bg-indigo-50 px-4 py-2 font-semibold text-indigo-600">
            Generated on {toInputString(safeCertificate.generatedDate)}
          </span>
          <span className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-600">
            Verified by CampusConnect
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
