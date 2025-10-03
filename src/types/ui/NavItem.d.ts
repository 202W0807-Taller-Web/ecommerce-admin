export type NavItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: { label: string; path: string }[];
}