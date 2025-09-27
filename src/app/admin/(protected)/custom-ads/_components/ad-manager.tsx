
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { saveAd, deleteAd } from '../actions';
import type { CustomAd } from '@/lib/definitions';
import { Loader2, Save, Trash2, Edit, PlusCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


function SubmitButton({ adId }: { adId?: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {pending ? 'Saving...' : (adId ? 'Save Changes' : 'Save New Ad')}
        </Button>
    )
}

const initialState = { success: false, message: '' };

interface AdManagerProps {
    allAds: CustomAd[];
}

export default function AdManager({ allAds }: AdManagerProps) {
    const [state, formAction] = useActionState(saveAd, initialState);
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [editingAd, setEditingAd] = useState<CustomAd | null>(null);

    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Success' : 'Error',
                description: state.message,
            });
             if (state.success) {
                setEditingAd(null); // Reset form on success
            }
        }
    }, [state, toast]);
    
    const handleSetEditingAd = (ad: CustomAd | null) => {
        setEditingAd(ad);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = (adId: string) => {
        startTransition(async () => {
            const result = await deleteAd(adId);
            if(result.success) {
                toast({ title: 'Success', description: result.message });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        });
    }

    return (
    <div className="space-y-8">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{editingAd ? 'Edit Ad' : 'Create New Ad'}</CardTitle>
                <CardDescription>Configure the video ad that users will see. After saving, it will be added to the list of available ads for random rotation.</CardDescription>
            </CardHeader>
            <form action={formAction}>
                 <input type="hidden" name="adId" value={editingAd?._id.toString() || ''} />
                <CardContent className="space-y-8">
                    {/* Video Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Video & Link</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="videoUrl">Ad Video URL</Label>
                                <Input id="videoUrl" name="videoUrl" placeholder="https://example.com/ad.mp4" defaultValue={editingAd?.videoUrl} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ctaLink">Button Click Link</Label>
                                <Input id="ctaLink" name="ctaLink" placeholder="https://product-landing-page.com" defaultValue={editingAd?.ctaLink} required />
                            </div>
                        </div>
                    </div>
                    
                    {/* CTA Button Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Call-to-Action Button</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">Button Text</Label>
                                <Input id="ctaText" name="ctaText" placeholder="e.g., Install Now" defaultValue={editingAd?.ctaText} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Button Shape</Label>
                                <RadioGroup name="ctaShape" defaultValue={editingAd?.ctaShape || 'rounded'} className="flex flex-wrap gap-4 pt-2">
                                    <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="pill" /> Pill</Label>
                                    <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="rounded" /> Rounded</Label>
                                    <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="square" /> Square</Label>
                                </RadioGroup>
                            </div>
                        </div>
                         <div className="space-y-4 mt-6">
                             <Label>Button Color</Label>
                             <RadioGroup name="ctaColor" defaultValue={editingAd?.ctaColor || 'primary'} className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="primary" /> Primary</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="destructive" /> Destructive</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="outline" /> Outline</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="blue" /> Blue</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="green" /> Green</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="yellow" /> Yellow</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="black" /> Black</Label>
                                <Label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="grey" /> Grey</Label>
                            </RadioGroup>
                        </div>
                         <div className="flex items-center space-x-2 pt-4">
                            <Checkbox id="hideCtaButton" name="hideCtaButton" defaultChecked={editingAd?.hideCtaButton} />
                            <Label htmlFor="hideCtaButton" className="cursor-pointer">Hide CTA Button (video will be clickable)</Label>
                        </div>
                    </div>

                     {/* Timing Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Timing (in seconds)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="totalDuration">Total Ad Duration</Label>
                                <Input id="totalDuration" name="totalDuration" type="number" min="5" placeholder="e.g., 30" defaultValue={editingAd?.totalDuration || 30} required />
                                <p className="text-xs text-muted-foreground">The page will auto-close after this many seconds.</p>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="rewardTime">Reward Generation Time (Optional)</Label>
                                <Input id="rewardTime" name="rewardTime" type="number" min="1" placeholder="e.g., 15" defaultValue={editingAd?.rewardTime || ''} />
                                <p className="text-xs text-muted-foreground">If empty, reward is given at the end. The "Skip Ad" button will appear at this time.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {editingAd && <Button variant="ghost" onClick={() => setEditingAd(null)}>Cancel Edit</Button>}
                    <SubmitButton adId={editingAd?._id.toString()} />
                </CardFooter>
            </form>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                 <div>
                    <CardTitle>Ad Library</CardTitle>
                    <CardDescription>This is a list of all available ads. One of these will be shown to users at random.</CardDescription>
                </div>
                 <Button variant="outline" onClick={() => handleSetEditingAd(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Ad
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
            {allAds.length > 0 ? (
                allAds.map(ad => (
                    <div key={ad._id.toString()} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex-1 space-y-2">
                            <p className="font-semibold text-primary">{ad.ctaText}</p>
                            <p className="text-sm text-muted-foreground truncate">Video: {ad.videoUrl}</p>
                            <p className="text-sm text-muted-foreground truncate">Link: {ad.ctaLink}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-center">
                            <Button variant="outline" size="icon" onClick={() => handleSetEditingAd(ad)}>
                                <Edit className="h-4 w-4"/>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" disabled={isPending}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently delete this ad. This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(ad._id.toString())}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-8">No ads have been created yet.</p>
            )}
            </CardContent>
        </Card>
    </div>
    );
}
