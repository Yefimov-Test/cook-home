import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  DollarSign,
  Clock,
  Users,
  UserPlus,
  ClipboardList,
  ShoppingBag,
} from "lucide-react";

export default function BecomeACookPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <ChefHat className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Готовите с душой?
            <br />
            <span className="text-primary">Делитесь этим с другими</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Зарегистрируйтесь как повар, создайте меню и принимайте заказы от
            людей рядом с вами.
          </p>
          <Button size="lg" render={<Link href="/signup" />}>
            Зарегистрироваться
          </Button>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Три простых шага
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: UserPlus,
                step: "1",
                title: "Регистрация",
                desc: "Создайте аккаунт и выберите роль повара",
              },
              {
                icon: ClipboardList,
                step: "2",
                title: "Заполните профиль",
                desc: "Добавьте описание, тип кухни, фото и меню",
              },
              {
                icon: ShoppingBag,
                step: "3",
                title: "Начните получать заказы",
                desc: "После модерации ваш профиль появится в каталоге",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative rounded-full bg-primary/10 p-5 mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-1 -right-1 size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Почему повара выбирают нас
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Свободный график",
                desc: "Готовьте когда удобно. Настройте дни и время самовывоза сами.",
              },
              {
                icon: DollarSign,
                title: "Свои цены",
                desc: "Устанавливайте стоимость блюд самостоятельно. Комиссия платформы всего 15%.",
              },
              {
                icon: Users,
                title: "Без аренды кухни",
                desc: "Готовьте дома, клиенты из вашего района найдут вас через каталог.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-muted-foreground mb-6">
            Регистрация занимает пару минут. Начните зарабатывать на том, что
            любите.
          </p>
          <Button size="lg" render={<Link href="/signup" />}>
            Стать поваром
          </Button>
        </div>
      </section>
    </div>
  );
}
