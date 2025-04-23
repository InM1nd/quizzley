"use client";

import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedSection } from "@/components/ui/animated-section";
import Aurora from "@/components/ui/aurora";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={["#FF6B00", "#FFA500", "#FF4500"]}
            blend={1.0}
            amplitude={0.5}
            speed={0.3}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Свяжитесь с <span className="text-primary">Нами</span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                У вас есть вопросы или предложения? Мы будем рады помочь и
                выслушать ваше мнение.
              </AnimatedHeading>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
            {/* Contact Information */}
            <AnimatedCard
              delay={0.1}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Контактная информация
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">Email</h3>
                      <p className="mt-1 text-gray-300">info@quizzley.com</p>
                      <p className="mt-1 text-gray-300">support@quizzley.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Телефон
                      </h3>
                      <p className="mt-1 text-gray-300">+7 (123) 456-7890</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Пн-Пт, 9:00-18:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">Адрес</h3>
                      <p className="mt-1 text-gray-300">
                        123 Технологический проспект, <br />
                        Москва, Россия, 123456
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Время работы
                      </h3>
                      <p className="mt-1 text-gray-300">
                        Понедельник - Пятница: 9:00 - 18:00
                        <br />
                        Суббота - Воскресенье: Выходной
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Мы в социальных сетях
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Contact Form */}
            <AnimatedCard
              delay={0.2}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <MessageCircle className="h-6 w-6 inline-block mr-2 text-primary" />
                  Напишите нам
                </h2>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">
                      Сообщение отправлено!
                    </h3>
                    <p className="text-gray-300 text-center">
                      Спасибо за обращение! Мы свяжемся с вами в ближайшее
                      время.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Отправить еще одно сообщение
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-zinc-400"
                      >
                        Ваше имя
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Иван Иванов"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-zinc-400"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-zinc-400"
                      >
                        Тема
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="Тема вашего сообщения"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-zinc-400"
                      >
                        Сообщение
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Напишите ваше сообщение здесь..."
                        required
                        className="min-h-[150px] bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Отправка..."
                      ) : (
                        <>
                          Отправить сообщение
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
