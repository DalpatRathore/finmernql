import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";

export function TextCard() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] rounded-2xl w-full">
      <TextRevealCard
        text="You know the business"
        revealText="Spend Nicely, Track Wisely"
      >
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          Hover over the card to reveal the hidden secret.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}
