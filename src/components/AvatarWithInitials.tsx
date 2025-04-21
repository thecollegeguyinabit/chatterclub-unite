
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "./messageUtils";

type AvatarWithInitialsProps = {
  name?: string;
  avatar?: string;
};

const AvatarWithInitials = ({ name, avatar }: AvatarWithInitialsProps) => (
  <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
    <AvatarImage src={avatar} alt={name} />
    <AvatarFallback>{name ? getInitials(name) : "U"}</AvatarFallback>
  </Avatar>
);

export default AvatarWithInitials;
